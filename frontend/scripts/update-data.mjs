// Stáhne veřejná data Vodárny Zlín a uloží je do frontend/content/*.json.
// Každý zdroj se zpracuje samostatně; soubor se přepíše jen tehdy, když prošel
// validací a jeho obsah se opravdu změnil (pak dostane nové `updatedAt`).
// Při chybě skript skončí s kódem 1 a chybný zdroj nechá beze změny.

import path from 'node:path'
import process from 'node:process'
import {
  BASE_URL,
  parseMunicipalityHardnessText,
  parsePricingHtml,
  parseQualityPage,
  parseQualityReportText,
  parseSupplyAreasHtml,
  parseTvrdostPage,
  validateQualityReport,
} from './data-parsers.mjs'
import { createContentStore } from './content-store.mjs'
import { extractPdfItemsText, extractPdfText } from './pdf-text.mjs'

const CONTENT_DIR = process.env.VODAZLIN_CONTENT_DIR || path.join(process.cwd(), 'content')
const USER_AGENT = 'Mozilla/5.0 (compatible; VodaZlin/1.0)'

const PAGES = {
  quality: `${BASE_URL}/o-nas/pitna-voda/kvalita-pitne-vody-na-zlinsku/`,
  hardness: `${BASE_URL}/o-nas/pitna-voda/tvrdost-vody/`,
  supplyAreas: `${BASE_URL}/o-nas/provozovane-vodovody/`,
  pricing: (year) => `${BASE_URL}/zakaznici/cena-vody/cena-vodneho-a-stocneho-${year}/`,
}

class HttpError extends Error {
  constructor(status, url) {
    super(`HTTP ${status} pro ${url}`)
    this.status = status
  }
}

async function fetchResponse(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new HttpError(res.status, url)
  return res
}

const fetchText = async (url) => (await fetchResponse(url)).text()
const fetchBuffer = async (url) => Buffer.from(await (await fetchResponse(url)).arrayBuffer())

const store = createContentStore(CONTENT_DIR, { transactional: true })
const readJson = store.read
const writeIfChanged = store.writeIfChanged

async function updateQuality(log) {
  const { reports, documents } = parseQualityPage(await fetchText(PAGES.quality))

  if (writeIfChanged('documents.json', { sourcePage: PAGES.quality, documents })) {
    log.push('documents.json: aktualizováno')
  }

  for (const report of reports) {
    const relativePath = `quality/${report.period}.json`
    const existing = readJson(relativePath)
    if (existing?.sourceUrl === report.url) continue

    const text = await extractPdfItemsText(await fetchBuffer(report.url))
    const parsed = validateQualityReport(parseQualityReportText(text))

    writeIfChanged(relativePath, {
      period: report.period,
      year: report.year,
      quarter: report.quarter,
      title: report.title,
      sourceUrl: report.url,
      sourcePage: PAGES.quality,
      limits: parsed.limits,
      plants: parsed.plants,
    })
    log.push(`${relativePath}: ${existing ? 'aktualizováno' : 'nový report'}`)
  }
}

async function updateMunicipalityHardness(log) {
  const link = parseTvrdostPage(await fetchText(PAGES.hardness))
  const existing = readJson('hardness-by-municipality.json')
  if (existing?.sourceUrl === link.url) return

  const { text, title } = await extractPdfText(await fetchBuffer(link.url))
  const parsed = parseMunicipalityHardnessText(text, title)

  if (writeIfChanged('hardness-by-municipality.json', {
    year: parsed.year,
    sourceUrl: link.url,
    sourcePage: PAGES.hardness,
    municipalities: parsed.municipalities,
  })) {
    log.push('hardness-by-municipality.json: aktualizováno')
  }
}

async function updateSupplyAreas(log) {
  const plants = parseSupplyAreasHtml(await fetchText(PAGES.supplyAreas))
  if (writeIfChanged('supply-areas.json', { sourcePage: PAGES.supplyAreas, plants })) {
    log.push('supply-areas.json: aktualizováno')
  }
}

async function updatePricing(log) {
  const year = Number(process.env.VODAZLIN_PRICE_YEAR || new Date().getFullYear())
  const url = PAGES.pricing(year)

  let html
  try {
    html = await fetchText(url)
  } catch (error) {
    // Ceník na nový rok bývá zveřejněn až koncem roku; do té doby platí ten poslední.
    if (error instanceof HttpError && error.status === 404 && readJson(`pricing/${year - 1}.json`)) {
      log.push(`pricing: ceník ${year} zatím není zveřejněn`)
      return
    }
    throw error
  }

  const parsed = parsePricingHtml(html)
  const roundPrice = (value) => Math.round(value * 100) / 100

  if (writeIfChanged(`pricing/${year}.json`, {
    year,
    validFrom: parsed.validFrom ?? `${year}-01-01`,
    prices: {
      water: { price: parsed.waterPrice, vat: parsed.vat, priceWithVat: parsed.waterPriceWithVat },
      sewage: { price: parsed.sewagePrice, vat: parsed.vat, priceWithVat: parsed.sewagePriceWithVat },
      total: {
        price: roundPrice(parsed.waterPrice + parsed.sewagePrice),
        priceWithVat: roundPrice(parsed.waterPriceWithVat + parsed.sewagePriceWithVat),
      },
    },
    sourceUrl: url,
  })) {
    log.push(`pricing/${year}.json: aktualizováno`)
  }
}

async function main() {
  const steps = {
    quality: updateQuality,
    municipalityHardness: updateMunicipalityHardness,
    supplyAreas: updateSupplyAreas,
    pricing: updatePricing,
  }
  const log = []
  const errors = []

  for (const [name, step] of Object.entries(steps)) {
    try {
      await step(log)
    } catch (error) {
      errors.push(`${name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (errors.length > 0) {
    store.rollback()
    console.error(`\nChyby:\n${errors.join('\n')}`)
    console.error('\nŽádná změna nebyla zapsána.')
    process.exitCode = 1
    return
  }

  store.commit()
  console.log(log.length > 0 ? log.join('\n') : 'Žádná změna dat.')
}

main()
