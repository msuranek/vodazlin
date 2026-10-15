import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pdfParse from 'pdf-parse'
import {
  calculateWaterQuality,
  normalizeHardness,
  parseHardnessText,
  parsePricingHtml,
} from './data-parsers.mjs'

const DATA_DIR = path.join(process.cwd(), 'data')
const year = process.env.VODAZLIN_PRICE_YEAR || String(new Date().getFullYear())

const DEFAULT_WATER_QUALITY = {
  timestamp: '2025-01-26T10:00:00Z',
  location: 'Zlín - centrální rozvod',
  parameters: {
    hardness: 10.8,
    pH: 7.4,
    nitrates: 18.5,
    iron: 0.08,
    manganese: 0.02,
    calcium: 64.5,
    magnesium: 18.3,
    chlorides: 12.8,
    sulfates: 28.4,
  },
  bacteriological: {
    ecoli: 0,
    enterococci: 0,
    coliformBacteria: 0,
  },
  score: 91,
  status: 'excellent',
}

const DEFAULT_WATER_SOURCES = [
  {
    id: 'klecuvka',
    name: 'ÚV Klečůvka',
    location: { lat: 49.2456, lng: 17.7234 },
    hardness: 9.0,
    hardnessMmol: 1.62,
    servesAreas: [
      'Východní část Zlína',
      'Štípa',
      'Kostelec',
      'Fryšták',
      'Želechovice nad Dřevnicí',
      'Lípa nad Dřevnicí',
      'Březová u Zlína',
      'Lukov',
      'Zádveřice',
      'Velíková',
      'Ostrata',
      'Hrobice',
      'Veselá',
      'Lužkovice',
      'Lukoveček',
    ],
    quality: 93,
    waterType: 'měkká až středně tvrdá',
  },
  {
    id: 'tlumacov',
    name: 'ÚV Tlumačov',
    location: { lat: 49.2678, lng: 17.4987 },
    hardness: 12.6,
    hardnessMmol: 2.26,
    servesAreas: [
      'Západní část Zlína',
      'Jaroslavice',
      'Racková',
      'Březnice u Zlína',
      'Otrokovice',
      'Napajedla',
      'Machová',
      'Mysločovice',
      'Hostišová',
      'Sazovice',
      'Tlumačov',
      'Halenkovice',
      'Žlutava',
      'Spytihněv',
      'Lhota u Malenovic',
      'Salaš u Zlína',
      'Tečovice',
      'Bohuslavice u Zlína',
    ],
    quality: 92,
    waterType: 'středně tvrdá',
  },
]

const DEFAULT_METADATA = {
  lastUpdate: '2025-01-26',
  waterQualityUpdatedAt: '2025-01-26T10:00:00Z',
  pricesUpdatedAt: '2025-01-01',
  siteDataUpdatedAt: '2025-01-26T10:00:00Z',
  sources: [
    { name: 'Vodárna Zlín a.s.', url: 'https://www.vodarnazlin.cz' },
  ],
  updateFrequency: 'čtvrtletně',
  pricingUpdateFrequency: 'ročně podle zveřejněného ceníku',
  hardnessUpdateFrequency: 'podle dostupných veřejných podkladů',
}

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJson(filename, fallback) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

function writeJson(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), `${JSON.stringify(data, null, 2)}\n`)
}

async function scrapePricing() {
  const url = `https://www.vodarnazlin.cz/zakaznici/cena-vody/cena-vodneho-a-stocneho-${year}/`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VodaZlin/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} pro ceník ${url}`)

  const html = await res.text()
  const { waterPrice, waterPriceWithVat, sewagePrice, sewagePriceWithVat } = parsePricingHtml(html)

  return {
    lastUpdate: new Date().toISOString().split('T')[0],
    validFrom: `1. ledna ${year}`,
    prices: {
      water: { price: waterPrice, vat: 12, priceWithVat: waterPriceWithVat },
      sewage: { price: sewagePrice, vat: 12, priceWithVat: sewagePriceWithVat },
      total: {
        price: Math.round((waterPrice + sewagePrice) * 100) / 100,
        priceWithVat: Math.round((waterPriceWithVat + sewagePriceWithVat) * 100) / 100,
      },
    },
    averageConsumption: { person: 95, household2: 58, household4: 116 },
    source: url,
  }
}

async function scrapeWaterHardness() {
  const pdfUrl = process.env.VODAZLIN_HARDNESS_PDF_URL || 'https://www.vodarnazlin.cz/res/archive/002/001585.pdf?seek=1734076813'
  const res = await fetch(pdfUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VodaZlin/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} pro PDF ${pdfUrl}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const data = await pdfParse(buffer)
  return parseHardnessText(data.text)
}

async function main() {
  const results = {}
  const errors = []
  const metadata = readJson('metadata.json', DEFAULT_METADATA)
  const now = new Date().toISOString()

  ensureDir()
  metadata.sources = DEFAULT_METADATA.sources

  try {
    const pricing = await scrapePricing()
    writeJson('pricing.json', pricing)
    metadata.pricesUpdatedAt = pricing.lastUpdate
    results.pricing = { updated: true, data: pricing }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`pricing: ${message}`)
    results.pricing = { updated: false, error: message }
  }

  try {
    const hardness = await scrapeWaterHardness()
    if (hardness.klecuvka !== null || hardness.tlumacov !== null) {
      const existingSources = readJson('water_sources.json', DEFAULT_WATER_SOURCES)
      const updated = existingSources.map((source) => {
        if (source.id === 'klecuvka' && hardness.klecuvka !== null) {
          const normalized = normalizeHardness(hardness.klecuvka)
          return {
            ...source,
            hardness: normalized.hardness,
            hardnessMmol: normalized.hardnessMmol,
          }
        }
        if (source.id === 'tlumacov' && hardness.tlumacov !== null) {
          const normalized = normalizeHardness(hardness.tlumacov)
          return {
            ...source,
            hardness: normalized.hardness,
            hardnessMmol: normalized.hardnessMmol,
          }
        }
        return source
      })

      writeJson('water_sources.json', updated)
      metadata.waterQualityUpdatedAt = now
      results.waterHardness = {
        updated: true,
        klecuvka: hardness.klecuvka,
        tlumacov: hardness.tlumacov,
      }
    } else {
      results.waterHardness = {
        updated: false,
        note: 'Hodnoty tvrdosti nenalezeny v PDF',
        debug: hardness.rawText,
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`waterHardness: ${message}`)
    results.waterHardness = { updated: false, error: message }
  }

  try {
    const quality = readJson('water_quality.json', DEFAULT_WATER_QUALITY)
    quality.timestamp = now
    quality.score = calculateWaterQuality(quality.parameters, quality.bacteriological)
    writeJson('water_quality.json', quality)
    results.timestamp = { updated: true, value: quality.timestamp }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`timestamp: ${message}`)
    results.timestamp = { updated: false, error: message }
  }

  metadata.lastUpdate = now.split('T')[0]
  metadata.siteDataUpdatedAt = now
  writeJson('metadata.json', metadata)
  results.metadata = { updated: true, data: metadata }

  console.log(JSON.stringify({ ok: errors.length === 0, results, errors }, null, 2))
  if (errors.length > 0) process.exitCode = 1
}

main()
