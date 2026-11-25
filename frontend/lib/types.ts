export type PlantId = "tlumacov" | "klecuvka";

export type ParameterKey =
  | "nitrates"
  | "coliformBacteria"
  | "enterococci"
  | "ecoli"
  | "iron"
  | "manganese"
  | "hardness"
  | "calcium"
  | "magnesium"
  | "pH";

// Hodnota tak, jak je v PDF. `value` je null, když je výsledek pod mezí
// stanovitelnosti (`raw` = "<0,02", `lessThan` = 0.02).
export interface Measurement {
  raw: string;
  value: number | null;
  lessThan?: number;
}

export interface Limit {
  raw: string;
  type: "NMH" | "MH" | "DH";
  min?: number;
  max: number;
}

export interface QualityReport {
  period: string; // "2026-Q3"
  year: number;
  quarter: number;
  title: string;
  sourceUrl: string;
  sourcePage: string;
  limits: Record<ParameterKey, Limit>;
  plants: Record<PlantId, Record<ParameterKey, Measurement>>;
  updatedAt: string;
}

export interface PlantSummary {
  id: PlantId;
  name: string;
  location: { lat: number; lng: number };
  hardness: number; // °dH
  hardnessMmol: number;
  waterType: string;
  quality: number; // orientační index webu
  servesAreas: string[];
  period: string;
  sourceUrl: string;
}

export interface DistrictSummary {
  id: string;
  name: string;
  mainSource: PlantId;
  hardness: number; // °dH
  quality: number;
}

export interface QualityDocument {
  title: string;
  url: string;
  fileId: string | null;
}

export interface WaterPricing {
  year: number;
  validFrom: string; // "1. ledna 2026"
  prices: {
    water: { price: number; vat: number; priceWithVat: number };
    sewage: { price: number; vat: number; priceWithVat: number };
    total: { price: number; priceWithVat: number };
  };
  averageConsumption: {
    person: number; // l/os/den
    household2: number; // m³/rok
    household4: number; // m³/rok
    region: string;
    year: number;
    sourceUrl: string;
  };
  source: string;
}

export interface DataMetadata {
  updatedAt: string;
  latestPeriod: string;
  latestPeriodLabel: string;
  sources: { name: string; url: string }[];
}
