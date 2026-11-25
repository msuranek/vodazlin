import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import {
  parseMunicipalityHardnessText,
  parsePricingHtml,
  parseQualityPage,
  parseQualityReportText,
  parseSupplyAreasHtml,
  parseTvrdostPage,
  validateQualityReport,
} from '../scripts/data-parsers.mjs'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')
const fixture = (name) => fs.readFileSync(path.join(fixturesDir, name), 'utf8')

describe('parseQualityPage', () => {
  const page = parseQualityPage(fixture('quality-page.html'))

  test('najde všechny kvartální reporty seřazené podle období', () => {
    expect(page.reports.map((r) => r.period)).toEqual([
      '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3',
    ])
  })

  test('určuje období z textu odkazu, ne z chybného title', () => {
    // Odkaz na Q3 2025 má v HTML title „Q2 2025“.
    const q3 = page.reports.find((r) => r.period === '2025-Q3')
    expect(q3.url).toContain('001655.pdf')
    expect(page.reports.find((r) => r.period === '2025-Q2').url).toContain('001630.pdf')
  })

  test('vrací absolutní URL a ID souboru', () => {
    const latest = page.reports.at(-1)
    expect(latest).toMatchObject({
      period: '2026-Q3',
      fileId: '1742',
      url: 'https://www.vodarnazlin.cz/res/archive/004/001742.pdf?seek=1793366759',
    })
  })

  test('ostatní PDF odkazy vrací jako dokumenty (výjimky)', () => {
    expect(page.documents.map((d) => d.title)).toContain('Rozhodnutí o výjimce 16.4.2026 VDJ Veselá')
    expect(page.documents.every((d) => !/Zlínsku Q\d/.test(d.title))).toBe(true)
  })

  test('selže, když stránka neobsahuje žádný report', () => {
    expect(() => parseQualityPage('<p>Nic</p>')).toThrow(/žádný kvartální report/)
  })
})

describe('parseQualityReportText', () => {
  test('čte sloupce ÚV Tlumačov a ÚV Klečůvka z layoutu Q3 2026', () => {
    const report = validateQualityReport(parseQualityReportText(fixture('quality-report-2026-q3.txt')))

    expect(report.plants.tlumacov.nitrates).toEqual({ raw: '5,3', value: 5.3 })
    expect(report.plants.klecuvka.nitrates).toEqual({ raw: '4,9', value: 4.9 })
    expect(report.plants.tlumacov.hardness.value).toBe(2.39)
    expect(report.plants.klecuvka.hardness.value).toBe(1.77)
    expect(report.plants.klecuvka.pH.value).toBe(7.85)
    expect(report.plants.tlumacov.ecoli.value).toBe(0)
  })

  test('zvládne odlišný layout Q4 2025 s desetinnými tečkami', () => {
    const report = validateQualityReport(parseQualityReportText(fixture('quality-report-2025-q4.txt')))

    expect(report.plants.tlumacov.nitrates).toEqual({ raw: '5,1', value: 5.1 })
    expect(report.plants.klecuvka.nitrates).toEqual({ raw: '3,6', value: 3.6 })
    expect(report.plants.klecuvka.iron).toEqual({ raw: '0,10', value: 0.1 })
    expect(report.plants.tlumacov.hardness.value).toBe(2.38)
  })

  test('hodnoty pod mezí stanovitelnosti zachová jako text', () => {
    const report = parseQualityReportText(fixture('quality-report-2026-q3.txt'))
    expect(report.plants.tlumacov.manganese).toEqual({ raw: '<0,02', value: null, lessThan: 0.02 })
  })

  test('načte limity z PDF', () => {
    const { limits } = parseQualityReportText(fixture('quality-report-2026-q3.txt'))
    expect(limits.nitrates).toMatchObject({ type: 'NMH', max: 50 })
    expect(limits.hardness).toMatchObject({ type: 'DH', min: 2, max: 3.5 })
    expect(limits.pH).toMatchObject({ type: 'MH', min: 6.5, max: 9.5 })
  })

  test('selže, když chybí ukazatel', () => {
    const text = fixture('quality-report-2026-q3.txt').replace(/hořčík/g, 'xxx')
    expect(() => parseQualityReportText(text)).toThrow(/chybí ukazatel magnesium/)
  })

  test('selže, když hlavička nemá úpravny v očekávaném pořadí', () => {
    const text = fixture('quality-report-2026-q3.txt').replace('ÚV Štítná', 'ÚV Tlumačov').replace(/Ú\s*V\s*T\s*l\s*u\s*m\s*a\s*č\s*o\s*v/, 'XX')
    expect(() => parseQualityReportText(text)).toThrow(/Hlavička reportu/)
  })
})

describe('validateQualityReport', () => {
  const base = () => parseQualityReportText(fixture('quality-report-2026-q3.txt'))

  test('odhalí přehozené sloupce přes kontrolu tvrdosti a Ca+Mg', () => {
    const report = base()
    const swapped = report.plants.tlumacov.hardness
    report.plants.tlumacov.hardness = report.plants.klecuvka.hardness
    report.plants.klecuvka.hardness = swapped

    expect(() => validateQualityReport(report)).toThrow(/neodpovídá Ca\+Mg/)
  })

  test('odhalí hodnotu mimo rozsah', () => {
    const report = base()
    report.plants.klecuvka.pH = { raw: '74,2', value: 74.2 }
    expect(() => validateQualityReport(report)).toThrow(/pH: hodnota 74,2 mimo rozsah/)
  })

  test('odhalí nečekaný limit (špatně přečtený řádek)', () => {
    const report = base()
    report.limits.nitrates = { raw: '0,50', type: 'NMH', max: 0.5 }
    expect(() => validateQualityReport(report)).toThrow(/nitrates: limit/)
  })

  test('odhalí necelé číslo u bakterií', () => {
    const report = base()
    report.plants.tlumacov.ecoli = { raw: '0,5', value: 0.5 }
    expect(() => validateQualityReport(report)).toThrow(/celé číslo/)
  })
})

describe('tvrdost po obcích', () => {
  test('najde odkaz na aktuální PDF na stránce tvrdosti', () => {
    expect(parseTvrdostPage(fixture('hardness-page.html')).url).toContain('001585.pdf')
  })

  test('načte tabulku obcí včetně částí Zlína', () => {
    const result = parseMunicipalityHardnessText(
      fixture('hardness-by-municipality.txt'),
      'Tvrdost pitné vody v obcích na Zlínsku 2025.xlsx',
    )

    expect(result.year).toBe(2025)
    expect(result.municipalities.length).toBeGreaterThan(80)
    expect(result.municipalities).toContainEqual({ name: 'Zlín z ÚV Klečůvka (východní část)', hardnessMmol: 1.7 })
    expect(result.municipalities).toContainEqual({ name: 'Kašava (z ÚV Klečůvka)', hardnessMmol: 1.6 })
  })

  test('selže u nečekaného formátu', () => {
    expect(() => parseMunicipalityHardnessText('Úpravna vody Klečůvka 1,62 mmol/l')).toThrow(/nečekaný formát/)
  })
})

describe('parseSupplyAreasHtml', () => {
  test('načte obce zásobované jednotlivými úpravnami', () => {
    const areas = parseSupplyAreasHtml(fixture('supply-areas.html'))

    expect(areas.klecuvka[0]).toBe('Východní část Zlína')
    expect(areas.klecuvka).toContain('Veselá')
    expect(areas.tlumacov[0]).toBe('Západní část Zlína')
    expect(areas.tlumacov).toContain('Šarovy')
    expect(areas.tlumacov).not.toContain('Štípa')
  })

  test('selže, když výčet chybí', () => {
    expect(() => parseSupplyAreasHtml('<p>Zásobeno z ÚV Klečůvka: Štípa</p>')).toThrow()
  })
})

describe('parsePricingHtml', () => {
  test('načte ceny a dopočítá DPH', () => {
    expect(parsePricingHtml(fixture('pricing.html'))).toEqual({
      waterPrice: 63.59,
      waterPriceWithVat: 71.22,
      sewagePrice: 59.46,
      sewagePriceWithVat: 66.6,
      vat: 12,
      validFrom: null,
    })
  })

  test('načte datum platnosti', () => {
    const html = '<p>Cena platná od 01.01.2026:</p><p>Vodné 63,59 71,22</p><p>Stočné 59,46 66,60</p>'
    expect(parsePricingHtml(html).validFrom).toBe('2026-01-01')
  })

  test('selže u neúplného HTML', () => {
    expect(() => parsePricingHtml('<p>Vodné 63,59 71,22</p>')).toThrow(/Nelze parsovat ceny/)
  })

  test('selže u nepravděpodobných cen', () => {
    expect(() => parsePricingHtml('<p>Vodné 12,00 13,44</p><p>Stočné 59,46 66,60</p>')).toThrow(/Ceny mimo rozsah/)
  })
})
