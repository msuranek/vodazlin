export function czNum(value) {
  return Number.parseFloat(value.replace(',', '.'))
}

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

  return { waterPrice, waterPriceWithVat, sewagePrice, sewagePriceWithVat }
}

export function parseHardnessText(text) {
  const klecuvkaMatch = text.match(/Kle[cč][uúů]vka[^\n]*?(\d+[,\.]\d+)/i)
  const tlumacovMatch = text.match(/Tluma[cč]ov[^\n]*?(\d+[,\.]\d+)/i)

  return {
    klecuvka: klecuvkaMatch ? czNum(klecuvkaMatch[1]) : null,
    tlumacov: tlumacovMatch ? czNum(tlumacovMatch[1]) : null,
    rawText: text.substring(0, 500),
  }
}

export function normalizeHardness(value) {
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

export function calculateWaterQuality(params, bacteriological) {
  let score = 96

  if (params.hardness < 7) {
    score -= Math.min(12, (7 - params.hardness) * 2)
  } else if (params.hardness > 14) {
    score -= Math.min(12, (params.hardness - 14) * 1.5)
  }

  score -= Math.min(8, Math.abs(params.pH - 7.4) * 2)
  if (params.pH < 6.5) {
    score -= 20 + (6.5 - params.pH) * 10
  } else if (params.pH > 8.5) {
    score -= 20 + (params.pH - 8.5) * 10
  }

  score -= Math.min(10, (params.nitrates / 50) * 6)
  if (params.nitrates > 50) {
    score -= 30
  } else if (params.nitrates > 25) {
    score -= (params.nitrates - 25) * 0.8
  }

  if (typeof params.iron === 'number') {
    score -= Math.min(6, (params.iron / 0.2) * 3)
  }
  if (typeof params.iron === 'number' && params.iron > 0.2) {
    score -= (params.iron - 0.2) * 50
  }

  if (typeof params.manganese === 'number') {
    score -= Math.min(6, (params.manganese / 0.05) * 3)
  }
  if (typeof params.manganese === 'number' && params.manganese > 0.05) {
    score -= (params.manganese - 0.05) * 100
  }

  const hasBacteria =
    (bacteriological?.ecoli ?? 0) > 0 ||
    (bacteriological?.enterococci ?? 0) > 0 ||
    (bacteriological?.coliformBacteria ?? 0) > 0

  if (hasBacteria) {
    score -= 40
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}
