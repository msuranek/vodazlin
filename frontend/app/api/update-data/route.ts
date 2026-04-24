import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function czNum(s: string): number {
  return parseFloat(s.replace(',', '.'))
}

async function scrapePricing() {
  const url = 'https://www.vodarnazlin.cz/zakaznici/cena-vody/cena-vodneho-a-stocneho-2026/'
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VodaZlin/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const html = await res.text()

  // Ceny jsou v HTML jako: vodné ... 63,59 ... 71,22 / stočné ... 59,46 ... 66,60
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

  const yearMatch = url.match(/(\d{4})\//)
  const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear())

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
  const pdfUrl = 'https://www.vodarnazlin.cz/res/archive/002/001585.pdf?seek=1734076813'
  const res = await fetch(pdfUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VodaZlin/1.0)' },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status} pro PDF`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const { default: pdfParse } = await import('pdf-parse')
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

export async function POST() {
  const results: Record<string, unknown> = {}
  const errors: string[] = []

  ensureDir()

  // 1. Aktualizace cen
  try {
    const pricing = await scrapePricing()
    fs.writeFileSync(path.join(DATA_DIR, 'pricing.json'), JSON.stringify(pricing, null, 2))
    results.pricing = { updated: true, data: pricing }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    errors.push(`pricing: ${msg}`)
    results.pricing = { updated: false, error: msg }
  }

  // 2. Aktualizace tvrdosti vody z PDF
  try {
    const hardness = await scrapeWaterHardness()

    if (hardness.klecuvka !== null || hardness.tlumacov !== null) {
      const { waterSources } = await import('@/lib/data')
      const updated = waterSources.map(source => {
        if (source.id === 'klecuvka' && hardness.klecuvka !== null) {
          return {
            ...source,
            hardness: hardness.klecuvka,
            hardnessMmol: Math.round((hardness.klecuvka / 5.608) * 100) / 100,
          }
        }
        if (source.id === 'tlumacov' && hardness.tlumacov !== null) {
          return {
            ...source,
            hardness: hardness.tlumacov,
            hardnessMmol: Math.round((hardness.tlumacov / 5.608) * 100) / 100,
          }
        }
        return source
      })
      fs.writeFileSync(path.join(DATA_DIR, 'water_sources.json'), JSON.stringify(updated, null, 2))
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    errors.push(`waterHardness: ${msg}`)
    results.waterHardness = { updated: false, error: msg }
  }

  // 3. Aktualizace timestampu — "Aktualizováno" na webu
  try {
    const { currentWaterQuality } = await import('@/lib/data')
    const qualityFile = path.join(DATA_DIR, 'water_quality.json')
    const existing = fs.existsSync(qualityFile)
      ? JSON.parse(fs.readFileSync(qualityFile, 'utf-8'))
      : currentWaterQuality
    existing.timestamp = new Date().toISOString()
    fs.writeFileSync(qualityFile, JSON.stringify(existing, null, 2))
    results.timestamp = { updated: true, value: existing.timestamp }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    results.timestamp = { updated: false, error: msg }
  }

  // Invalidace cache stránek — při dalším requestu se překreslí s novými daty
  revalidatePath('/')
  revalidatePath('/ceny')
  revalidatePath('/kvalita')
  revalidatePath('/mapa')

  return NextResponse.json(
    {
      ok: errors.length === 0,
      updatedAt: new Date().toISOString(),
      results,
      errors,
    },
    { status: errors.length === 0 ? 200 : 207 }
  )
}
