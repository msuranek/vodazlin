// Načítá data z frontend/content/*.json při buildu. Pokud data chybí,
// build selže — web nemá žádné záložní (vymyšlené) hodnoty.

import fs from "fs";
import path from "path";
import { averageConsumption, plants, zlinDistricts } from "./data";
import type {
  DataMetadata,
  DistrictSummary,
  Measurement,
  ParameterKey,
  PlantId,
  PlantSummary,
  QualityDocument,
  QualityReport,
  WaterPricing,
} from "./types";
import { formatPeriod } from "./report-display";
import { calculateWaterQuality, formatDate, getHardnessLabel } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DH_PER_MMOL = 5.608;

function readJson<T>(relativePath: string): T {
  const file = path.join(CONTENT_DIR, relativePath);
  if (!fs.existsSync(file)) {
    throw new Error(`Chybí datový soubor ${relativePath}. Spusťte \`npm run update-data\`.`);
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function listJson(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((name) => name.endsWith(".json")).sort();
}

export function numericValue(measurement: Measurement): number {
  // Hodnota pod mezí stanovitelnosti se do výpočtů bere jako nezjištěná (0).
  return measurement.value ?? 0;
}

export { formatPeriod as periodLabel };

export function getQualityHistory(): QualityReport[] {
  const reports = listJson("quality").map((name) => readJson<QualityReport>(`quality/${name}`));
  if (reports.length === 0) {
    throw new Error("Chybí kvartální reporty v content/quality/. Spusťte `npm run update-data`.");
  }
  return reports.sort((a, b) => a.period.localeCompare(b.period));
}

export function getLatestReport(): QualityReport {
  const history = getQualityHistory();
  return history[history.length - 1];
}

// Ukazatele, které překročily hygienický limit (NMH/MH). Doporučené hodnoty (DH)
// nejsou limitem, jejich nesplnění se nehlásí.
export function getLimitExceedances(report: QualityReport): { plantId: PlantId; key: ParameterKey }[] {
  const result: { plantId: PlantId; key: ParameterKey }[] = [];
  for (const plant of plants) {
    for (const key of Object.keys(report.limits) as ParameterKey[]) {
      const limit = report.limits[key];
      const measurement = report.plants[plant.id][key];
      if (limit.type === "DH" || measurement.value === null) continue;
      if (measurement.value > limit.max || (limit.min !== undefined && measurement.value < limit.min)) {
        result.push({ plantId: plant.id, key });
      }
    }
  }
  return result;
}

export function getPlantScore(report: QualityReport, plantId: PlantId): number {
  const p = report.plants[plantId];
  return calculateWaterQuality(
    {
      hardness: numericValue(p.hardness) * DH_PER_MMOL,
      pH: numericValue(p.pH),
      nitrates: numericValue(p.nitrates),
      iron: numericValue(p.iron),
      manganese: numericValue(p.manganese),
    },
    {
      ecoli: numericValue(p.ecoli),
      enterococci: numericValue(p.enterococci),
      coliformBacteria: numericValue(p.coliformBacteria),
    },
  );
}

export function getWaterSources(): PlantSummary[] {
  const report = getLatestReport();
  const supply = readJson<{ plants: Record<PlantId, string[]> }>("supply-areas.json");

  return plants.map((plant) => {
    const hardnessMmol = numericValue(report.plants[plant.id].hardness);
    const hardness = Math.round(hardnessMmol * DH_PER_MMOL * 10) / 10;
    return {
      ...plant,
      hardness,
      hardnessMmol,
      waterType: getHardnessLabel(hardness),
      quality: getPlantScore(report, plant.id),
      servesAreas: supply.plants[plant.id] ?? [],
      period: report.period,
      sourceUrl: report.sourceUrl,
    };
  });
}

export function getDistricts(): DistrictSummary[] {
  const sources = getWaterSources();
  return zlinDistricts.map((district) => {
    const source = sources.find((item) => item.id === district.mainSource)!;
    return { ...district, hardness: source.hardness, quality: source.quality };
  });
}

export function getQualityDocuments(): QualityDocument[] {
  return readJson<{ documents: QualityDocument[] }>("documents.json").documents;
}

export function getMunicipalityHardness() {
  return readJson<{
    year: number | null;
    sourceUrl: string;
    sourcePage: string;
    municipalities: { name: string; hardnessMmol: number }[];
  }>("hardness-by-municipality.json");
}

export function getWaterPricing(): WaterPricing {
  const files = listJson("pricing");
  if (files.length === 0) throw new Error("Chybí ceník v content/pricing/.");
  const pricing = readJson<{
    year: number;
    validFrom: string;
    prices: WaterPricing["prices"];
    sourceUrl: string;
  }>(`pricing/${files[files.length - 1]}`);

  const yearly = (persons: number) => Math.round((persons * averageConsumption.person * 365) / 1000);

  return {
    year: pricing.year,
    validFrom: formatDate(pricing.validFrom),
    prices: pricing.prices,
    averageConsumption: {
      ...averageConsumption,
      household2: yearly(2),
      household4: yearly(4),
    },
    source: pricing.sourceUrl,
  };
}

// Jediné datum „poslední aktualizace“: kdy se naposledy změnila stažená data.
export function getDataMetadata(): DataMetadata {
  const files = [
    ...listJson("quality").map((name) => `quality/${name}`),
    ...listJson("pricing").map((name) => `pricing/${name}`),
    "documents.json",
    "supply-areas.json",
    "hardness-by-municipality.json",
  ];
  const updatedAt = files
    .map((file) => readJson<{ updatedAt?: string }>(file).updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .pop()!;

  const latest = getLatestReport();
  const pricing = getWaterPricing();

  return {
    updatedAt,
    latestPeriod: latest.period,
    latestPeriodLabel: formatPeriod(latest.period),
    sources: [
      { name: "Vodárna Zlín – kvalita pitné vody", url: latest.sourcePage },
      { name: "Vodárna Zlín – tvrdost vody", url: getMunicipalityHardness().sourcePage },
      { name: "Vodárna Zlín – provozované vodovody", url: "https://www.vodarnazlin.cz/o-nas/provozovane-vodovody/" },
      { name: `Vodárna Zlín – ceník ${pricing.year}`, url: pricing.source },
      { name: "ČSÚ – spotřeba vody v domácnostech", url: averageConsumption.sourceUrl },
    ],
  };
}
