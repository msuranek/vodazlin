import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pdfParse from 'pdf-parse'

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
  score: 92,
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

function czNum(value) {
  return Number.parseFloat(value.replace(',', '.'))
}

function normalizeHardness(value) {
  if (value < 5) {
    return {
      hardness: Math.round(value * 5.608 * 100) / 100,
      hardnessMmol: Math.round(value * 100) / 100,
    }
  }

  return {
    hardness: Math.round(value * 100) / 100,
    hardnessMmol: Math.round((value / 5.608) * 100) / 100,
  }
}

async function scrapePricing() {
  const url = `https://www.vodarnazlin.cz/zakaznici/cena-vody/cena-vodneho-a-stocneho-${year}/`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VodaZlin/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} pro ceník ${url}`)

  const html = await res.text()
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
  const text = data.text

  const klecuvkaMatch = text.match(/Kle[cč][uú]vka[^\n]*?(\d+[,\.]\d+)/i)
  const tlumacovMatch = text.match(/Tluma[cč]ov[^\n]*?(\d+[,\.]\d+)/i)

  return {
    klecuvka: klecuvkaMatch ? czNum(klecuvkaMatch[1]) : null,
    tlumacov: tlumacovMatch ? czNum(tlumacovMatch[1]) : null,
    rawText: text.substring(0, 500),
  }
}

async function main() {
  const results = {}
  const errors = []

  ensureDir()

  try {
    const pricing = await scrapePricing()
    writeJson('pricing.json', pricing)
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
    quality.timestamp = new Date().toISOString()
    writeJson('water_quality.json', quality)
    results.timestamp = { updated: true, value: quality.timestamp }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(`timestamp: ${message}`)
    results.timestamp = { updated: false, error: message }
  }

  console.log(JSON.stringify({ ok: errors.length === 0, results, errors }, null, 2))
  if (errors.length > 0) process.exitCode = 1
}

main()
