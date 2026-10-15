import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  calculateWaterQuality,
  normalizeHardness,
  parseHardnessText,
  parsePricingHtml,
} from '../scripts/data-parsers.mjs'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

test('parsePricingHtml extracts prices from a saved HTML fixture', () => {
  const html = fs.readFileSync(path.join(fixturesDir, 'pricing.html'), 'utf8')

  assert.deepEqual(parsePricingHtml(html), {
    waterPrice: 63.59,
    waterPriceWithVat: 71.22,
    sewagePrice: 59.46,
    sewagePriceWithVat: 66.6,
  })
})

test('parsePricingHtml rejects incomplete source HTML', () => {
  assert.throws(() => parsePricingHtml('<p>Vodné 63,59 71,22</p>'), /Nelze parsovat ceny/)
})

test('parsePricingHtml rejects implausible prices', () => {
  const html = '<p>Vodné 12,00 13,44</p><p>Stočné 59,46 66,60</p>'

  assert.throws(() => parsePricingHtml(html), /Ceny mimo rozsah/)
})

test('parseHardnessText extracts both plants from saved PDF text', () => {
  const text = fs.readFileSync(path.join(fixturesDir, 'hardness-report.txt'), 'utf8')

  assert.deepEqual(parseHardnessText(text), {
    klecuvka: 1.62,
    tlumacov: 12.6,
    rawText: text,
  })
})

test('parseHardnessText returns null for a missing plant', () => {
  assert.equal(parseHardnessText('Úpravna vody Klečůvka 1.70 mmol/l').tlumacov, null)
})

test('normalizeHardness handles mmol/l and °dH values', () => {
  assert.deepEqual(normalizeHardness(1.62), { hardness: 9.08, hardnessMmol: 1.62 })
  assert.deepEqual(normalizeHardness(12.6), { hardness: 12.6, hardnessMmol: 2.25 })
})

test('calculateWaterQuality penalizes bacteriological contamination', () => {
  const parameters = { hardness: 10.8, pH: 7.4, nitrates: 18.5, iron: 0.08, manganese: 0.02 }
  const cleanScore = calculateWaterQuality(parameters, { ecoli: 0 })
  const contaminatedScore = calculateWaterQuality(parameters, { ecoli: 1 })

  assert.equal(cleanScore - contaminatedScore, 40)
})
