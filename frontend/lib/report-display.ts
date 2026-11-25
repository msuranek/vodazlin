import type { Limit, ParameterKey } from "./types";

export const PARAMETER_META: Record<ParameterKey, { label: string; unit: string; description: string }> = {
  nitrates: { label: "Dusičnany", unit: "mg/l", description: "NO₃⁻" },
  coliformBacteria: { label: "Koliformní bakterie", unit: "KTJ/100 ml", description: "Celkové koliformní bakterie" },
  enterococci: { label: "Enterokoky", unit: "KTJ/100 ml", description: "Intestinální enterokoky" },
  ecoli: { label: "E. coli", unit: "KTJ/100 ml", description: "Escherichia coli" },
  iron: { label: "Železo", unit: "mg/l", description: "Fe" },
  manganese: { label: "Mangan", unit: "mg/l", description: "Mn" },
  hardness: { label: "Tvrdost vody", unit: "mmol/l", description: "Vápník + hořčík" },
  calcium: { label: "Vápník", unit: "mg/l", description: "Ca" },
  magnesium: { label: "Hořčík", unit: "mg/l", description: "Mg" },
  pH: { label: "pH", unit: "", description: "Kyselost / zásaditost" },
};

const LIMIT_TYPE_LABEL: Record<Limit["type"], string> = {
  NMH: "Nejvyšší mezní hodnota",
  MH: "Mezní hodnota",
  DH: "Doporučená hodnota",
};

export function describeLimit(limit: Limit, unit: string) {
  return {
    label: LIMIT_TYPE_LABEL[limit.type],
    text: `${limit.raw.replace(/\s*-\s*/, " – ")}${unit ? ` ${unit}` : ""}`,
  };
}

export function formatPeriod(period: string): string {
  const [year, quarter] = period.split("-Q");
  return `${quarter}. čtvrtletí ${year}`;
}

export function formatPeriodShort(period: string): string {
  const [year, quarter] = period.split("-Q");
  return `Q${quarter} ${year}`;
}
