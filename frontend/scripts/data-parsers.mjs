// Čisté parsery zdrojů Vodárny Zlín. Nic nestahují, jen zpracují HTML / text z PDF.
// Při nečekaném formátu vyhazují chybu, aby se neuložila špatná data.

export const BASE_URL = 'https://www.vodarnazlin.cz'

export const PLANTS = [
  { id: 'tlumacov', name: 'ÚV Tlumačov', column: 0 },
  { id: 'klecuvka', name: 'ÚV Klečůvka', column: 1 },
]

// Ukazatele, které čteme z kvartálního reportu. `label` hledá řádek tabulky,
// `limit` je očekávaný limit z PDF (kontrola, že čteme správný řádek).
export const QUALITY_PARAMETERS = {
  nitrates: { label: /dusičnany/i, unit: 'mg/l', limit: { max: 50, type: 'NMH' }, range: [0, 100] },
  coliformBacteria: { label: /koliformní bakterie/i, unit: 'KTJ/100 ml', limit: { max: 0, type: 'MH' }, range: [0, 10000], integer: true },
  enterococci: { label: /enterokoky/i, unit: 'KTJ/100 ml', limit: { max: 0, type: 'NMH' }, range: [0, 10000], integer: true },
  ecoli: { label: /escherichia coli/i, unit: 'KTJ/100 ml', limit: { max: 0, type: 'NMH' }, range: [0, 10000], integer: true },
  iron: { label: /železo/i, unit: 'mg/l', limit: { max: 0.2, type: 'MH' }, range: [0, 5] },
  manganese: { label: /mangan/i, unit: 'mg/l', limit: { max: 0.05, type: 'MH' }, range: [0, 2] },
  hardness: { label: /tvrdost/i, unit: 'mmol/l', limit: { min: 2, max: 3.5, type: 'DH' }, range: [0.1, 6] },
  calcium: { label: /vápník/i, unit: 'mg/l', limit: { min: 40, max: 80, type: 'DH' }, range: [1, 300] },
  magnesium: { label: /hořčík/i, unit: 'mg/l', limit: { min: 20, max: 30, type: 'DH' }, range: [0.1, 150] },
  pH: { label: /\bpH\b/, unit: '', limit: { min: 6.5, max: 9.5, type: 'MH' }, range: [5, 10] },
}

const CA_MOLAR = 40.08
const MG_MOLAR = 24.305
export const DH_PER_MMOL = 5.608

export function czNum(value) {
  return Number.parseFloat(String(value).replace(',', '.'))
}

function round(value, decimals) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim()
}

function absoluteUrl(href) {
  return new URL(decodeEntities(href), BASE_URL).toString()
}

function listArchiveLinks(html) {
  const links = []
  const re = /<a\b([^>]*\bhref="([^"]*\/res\/archive\/[^"]+)"[^>]*)>([\s\S]*?)<\/a>/gi
  let match
  while ((match = re.exec(html))) {
    const attrs = match[1]
    const fileId = attrs.match(/data-vizus-cms-file-id="(\d+)"/)?.[1] ?? match[2].match(/(\d+)\.pdf/)?.[1] ?? null
    links.push({
      text: htmlToText(match[3]),
      url: absoluteUrl(match[2]),
      fileId,
    })
  }
  return links
}

// --- Stránka „Kvalita pitné vody na Zlínsku“ ---------------------------------

// Období určujeme z textu odkazu. Atribut title ani název souboru nejsou spolehlivé
// (u Q3 2025 má odkaz title „Q2 2025“).
export function parseQualityPage(html) {
  const reports = new Map()
  const documents = []

  for (const link of listArchiveLinks(html)) {
    const match = link.text.match(/Kvalita pitné vody na Zlínsku\s+Q([1-4])\s+(\d{4})/i)
    if (match) {
      const quarter = Number(match[1])
      const year = Number(match[2])
      const period = `${year}-Q${quarter}`
      if (!reports.has(period)) {
        reports.set(period, { period, year, quarter, title: link.text, url: link.url, fileId: link.fileId })
      }
    } else if (link.text) {
      documents.push({ title: link.text, url: link.url, fileId: link.fileId })
    }
  }

  const sorted = [...reports.values()].sort((a, b) => a.period.localeCompare(b.period))
  if (sorted.length === 0) {
    throw new Error('Na stránce kvality nebyl nalezen žádný kvartální report')
  }

  return { reports: sorted, documents }
}

// --- Kvartální report (PDF) --------------------------------------------------

function parseLimit(raw) {
  const range = raw.match(/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)/)
  if (range) return { min: czNum(range[1]), max: czNum(range[2]) }
  return { max: czNum(raw) }
}

function parseMeasurement(raw) {
  const text = raw.replace(/\s+/g, '').replace('.', ',')
  if (text.startsWith('<')) {
    return { raw: text, value: null, lessThan: czNum(text.slice(1)) }
  }
  return { raw: text, value: czNum(text) }
}

// `text` = položky z getTextContent() spojené mezerou (viz extractPdfText).
// Ve sloupcích je pořadí: ÚV Tlumačov, ÚV Klečůvka, další zdroje…
export function parseQualityReportText(text) {
  const normalized = text.replace(/\s+/g, ' ')
  const compact = normalized.replace(/\s+/g, '')

  const firstRow = normalized.search(QUALITY_PARAMETERS.nitrates.label)
  const header = compact.slice(0, compact.search(/dusičnany/i))
  const tluIndex = header.indexOf('ÚVTlumačov')
  const kleIndex = header.indexOf('ÚVKlečůvka')
  if (firstRow < 0 || tluIndex < 0 || kleIndex < 0 || tluIndex > kleIndex) {
    throw new Error('Hlavička reportu neobsahuje sloupce ÚV Tlumačov a ÚV Klečůvka v očekávaném pořadí')
  }

  const limits = {}
  const plants = Object.fromEntries(PLANTS.map((plant) => [plant.id, {}]))

  for (const [key, def] of Object.entries(QUALITY_PARAMETERS)) {
    const labelMatch = def.label.exec(normalized.slice(firstRow))
    if (!labelMatch) throw new Error(`V reportu chybí ukazatel ${key}`)

    const afterLabel = normalized.slice(firstRow + labelMatch.index + labelMatch[0].length)
    const limitMatch = afterLabel.match(/(\d+(?:[.,]\d+)?(?:\s*-\s*\d+(?:[.,]\d+)?)?)\s*(NMH|MH|DH)\b/)
    if (!limitMatch) throw new Error(`U ukazatele ${key} chybí limit`)

    const afterLimit = afterLabel.slice(limitMatch.index + limitMatch[0].length)
    const tokens = afterLimit.match(/<\s?\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?/g) ?? []
    if (tokens.length < PLANTS.length) throw new Error(`U ukazatele ${key} chybí hodnoty`)

    limits[key] = { raw: limitMatch[1].replace(/\s+/g, ' '), type: limitMatch[2], ...parseLimit(limitMatch[1]) }
    for (const plant of PLANTS) {
      plants[plant.id][key] = parseMeasurement(tokens[plant.column])
    }
  }

  return { limits, plants }
}

export function validateQualityReport(report) {
  const errors = []

  for (const [key, def] of Object.entries(QUALITY_PARAMETERS)) {
    const limit = report.limits[key]
    if (!limit) {
      errors.push(`${key}: chybí limit`)
      continue
    }
    if (limit.type !== def.limit.type || limit.max !== def.limit.max || (def.limit.min ?? null) !== (limit.min ?? null)) {
      errors.push(`${key}: limit ${limit.raw} ${limit.type} neodpovídá očekávanému`)
    }

    for (const plant of PLANTS) {
      const measurement = report.plants[plant.id]?.[key]
      if (!measurement) {
        errors.push(`${plant.name} ${key}: chybí hodnota`)
        continue
      }
      const value = measurement.value ?? measurement.lessThan
      if (!Number.isFinite(value) || value < def.range[0] || value > def.range[1]) {
        errors.push(`${plant.name} ${key}: hodnota ${measurement.raw} mimo rozsah`)
      }
      if (def.integer && measurement.value !== null && !Number.isInteger(measurement.value)) {
        errors.push(`${plant.name} ${key}: očekáváno celé číslo, je ${measurement.raw}`)
      }
    }
  }

  // Kontrola sloupců: tvrdost musí odpovídat vápníku a hořčíku.
  for (const plant of PLANTS) {
    const p = report.plants[plant.id]
    if (!p?.hardness?.value || !p?.calcium?.value || !p?.magnesium?.value) continue
    const computed = p.calcium.value / CA_MOLAR + p.magnesium.value / MG_MOLAR
    const deviation = Math.abs(computed - p.hardness.value) / p.hardness.value
    if (deviation > 0.05) {
      errors.push(`${plant.name}: tvrdost ${p.hardness.raw} neodpovídá Ca+Mg (${round(computed, 2)} mmol/l)`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Report neprošel validací:\n- ${errors.join('\n- ')}`)
  }
  return report
}

// --- Tvrdost po obcích (PDF ze stránky Tvrdost vody) -------------------------

export function parseTvrdostPage(html) {
  const link = listArchiveLinks(html).find((item) => /aktuální informace|tvrdost/i.test(item.text))
  if (!link) throw new Error('Na stránce tvrdosti nebyl nalezen odkaz na PDF')
  return link
}

// `text` = výchozí výstup pdf-parse (řádky „ObecHodnotaObecHodnota“).
// `title` = titulek PDF, obsahuje rok (např. „Tvrdost pitné vody v obcích na Zlínsku 2025.xlsx“).
export function parseMunicipalityHardnessText(text, title = '') {
  const tableEnd = text.search(/Stupně tvrdosti/i)
  const table = tableEnd > 0 ? text.slice(0, tableEnd) : text
  const year = `${title} ${text}`.match(/na Zlínsku\s+(\d{4})/i)?.[1] ?? null

  const municipalities = []
  for (const line of table.split('\n')) {
    const re = /([^\d\n]+?)\s*(\d+,\d+)/g
    let match
    while ((match = re.exec(line))) {
      const name = match[1].replace(/\s+/g, ' ').trim()
      if (!name || /tvrdost|mmol/i.test(name)) continue
      municipalities.push({ name, hardnessMmol: czNum(match[2]) })
    }
  }

  const invalid = municipalities.filter((item) => item.hardnessMmol < 0.1 || item.hardnessMmol > 6)
  if (municipalities.length < 30 || invalid.length > 0) {
    throw new Error(`Tabulka tvrdosti po obcích má nečekaný formát (${municipalities.length} obcí, ${invalid.length} mimo rozsah)`)
  }

  return { year: year ? Number(year) : null, municipalities }
}

// --- Provozované vodovody (které obce zásobuje která úpravna) ---------------

export function parseSupplyAreasHtml(html) {
  const text = htmlToText(html)
  const result = {}

  for (const plant of PLANTS) {
    const short = plant.name.replace('ÚV ', '')
    const re = new RegExp(`Zásobeno z ÚV ${short}:\\s*(.+?)(?=Zásobeno z|Místní vodovod|Skupinový vodovod|$)`)
    const match = text.match(re)
    if (!match) throw new Error(`Na stránce vodovodů chybí výčet pro ${plant.name}`)

    const areas = match[1]
      .replace(/\s+a dále místní části? a obce\s+/i, ', ')
      .split(',')
      .map((item) => item.trim().replace(/\.$/, ''))
      .filter(Boolean)

    if (areas.length < 5 || !areas.some((item) => /Zlína/.test(item))) {
      throw new Error(`Výčet obcí pro ${plant.name} má nečekaný formát`)
    }
    result[plant.id] = areas
  }

  return result
}

// --- Ceník -------------------------------------------------------------------

export function parsePricingHtml(html) {
  const vodneMatch = html.match(/vodn[eé][^0-9]*?(\d{2,3}[,\.]\d{2})[^0-9]*?(\d{2,3}[,\.]\d{2})/i)
  const stocneMatch = html.match(/sto[cč]n[eé][^0-9]*?(\d{2,3}[,\.]\d{2})[^0-9]*?(\d{2,3}[,\.]\d{2})/i)

  if (!vodneMatch || !stocneMatch) {
    throw new Error('Nelze parsovat ceny z HTML')
  }

  const waterPrice = czNum(vodneMatch[1])
  const waterPriceWithVat = czNum(vodneMatch[2])
  const sewagePrice = czNum(stocneMatch[1])
  const sewagePriceWithVat = czNum(stocneMatch[2])

  if (waterPrice < 30 || waterPrice > 300 || sewagePrice < 30 || sewagePrice > 300) {
    throw new Error(`Ceny mimo rozsah: vodné=${waterPrice}, stočné=${sewagePrice}`)
  }

  const vat = Math.round((waterPriceWithVat / waterPrice - 1) * 100)
  const sewageVat = Math.round((sewagePriceWithVat / sewagePrice - 1) * 100)
  if (vat !== sewageVat || vat < 0 || vat > 25) {
    throw new Error(`Nekonzistentní DPH: vodné ${vat} %, stočné ${sewageVat} %`)
  }

  const validFrom = html.match(/platn[áé] od\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/i)

  return {
    waterPrice,
    waterPriceWithVat,
    sewagePrice,
    sewagePriceWithVat,
    vat,
    validFrom: validFrom
      ? `${validFrom[3]}-${validFrom[2].padStart(2, '0')}-${validFrom[1].padStart(2, '0')}`
      : null,
  }
}
