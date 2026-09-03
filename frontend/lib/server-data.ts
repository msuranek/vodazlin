import fs from 'fs'
import path from 'path'
import {
  currentWaterQuality,
  waterPricing,
  waterSources,
  zlínDistricts,
  historicalData,
  dataMetadata,
  healthLimits,
} from './data'
import { calculateWaterQuality } from './utils'

const DATA_DIR = path.join(process.cwd(), 'data')

function readJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getWaterQuality() {
  const quality = readJson('water_quality.json', currentWaterQuality)
  return {
    ...quality,
    score: calculateWaterQuality(quality.parameters, quality.bacteriological),
  }
}

export function getWaterPricing() {
  return readJson('pricing.json', waterPricing)
}

export function getWaterSources() {
  return readJson('water_sources.json', waterSources)
}

export function getDataMetadata() {
  const metadata = readJson('metadata.json', dataMetadata)
  const quality = readJson('water_quality.json', currentWaterQuality)
  const pricing = readJson('pricing.json', waterPricing)
  const hasQualitySnapshot = fs.existsSync(path.join(DATA_DIR, 'water_quality.json'))
  const hasPricingSnapshot = fs.existsSync(path.join(DATA_DIR, 'pricing.json'))
  const waterQualityUpdatedAt = hasQualitySnapshot ? quality.timestamp : metadata.waterQualityUpdatedAt
  const pricesUpdatedAt = hasPricingSnapshot ? pricing.lastUpdate : metadata.pricesUpdatedAt
  const siteDates = [waterQualityUpdatedAt, pricesUpdatedAt, metadata.siteDataUpdatedAt]
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value))

  const siteDataUpdatedAt = siteDates.length > 0
    ? new Date(Math.max(...siteDates)).toISOString()
    : metadata.siteDataUpdatedAt

  return {
    ...metadata,
    waterQualityUpdatedAt,
    pricesUpdatedAt,
    siteDataUpdatedAt,
    lastUpdate: siteDataUpdatedAt.split('T')[0],
  }
}

// Statická data — nemění se scraperem
export { zlínDistricts, historicalData, dataMetadata, healthLimits }
