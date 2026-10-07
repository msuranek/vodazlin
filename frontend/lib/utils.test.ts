import { describe, expect, it } from "vitest"

import {
  calculateWaterQuality,
  getScoreColor,
  getScoreLabel,
} from "./utils"

describe("calculateWaterQuality", () => {
  const representativeParams = {
    hardness: 10.8,
    pH: 7.4,
    nitrates: 18.5,
    iron: 0.08,
    manganese: 0.02,
  }

  it("returns the expected score for representative Zlín values", () => {
    expect(calculateWaterQuality(representativeParams)).toBe(91)
  })

  it("penalizes a bacteriological finding", () => {
    const cleanScore = calculateWaterQuality(representativeParams)
    const contaminatedScore = calculateWaterQuality(representativeParams, {
      ecoli: 1,
      enterococci: 0,
      coliformBacteria: 0,
    })

    expect(contaminatedScore).toBe(cleanScore - 40)
  })

  it("clamps an extremely poor result to zero", () => {
    expect(calculateWaterQuality(
      {
        hardness: 100,
        pH: 12,
        nitrates: 100,
        iron: 1,
        manganese: 1,
      },
      { ecoli: 1 },
    )).toBe(0)
  })
})

describe("score presentation", () => {
  it.each([
    [90, "Vynikající", "text-fresh-600"],
    [75, "Velmi dobrá", "text-water-600"],
    [60, "Dobrá", "text-yellow-600"],
    [40, "Přijatelná", "text-red-600"],
    [39, "Nevyhovující", "text-red-600"],
  ])("maps score %i to its label and color", (score, label, color) => {
    expect(getScoreLabel(score)).toBe(label)
    expect(getScoreColor(score)).toBe(color)
  })
})
