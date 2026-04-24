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
  return readJson('water_quality.json', currentWaterQuality)
}

export function getWaterPricing() {
  return readJson('pricing.json', waterPricing)
}

export function getWaterSources() {
  return readJson('water_sources.json', waterSources)
}

// Statická data — nemění se scraperem
export { zlínDistricts, historicalData, dataMetadata, healthLimits }
