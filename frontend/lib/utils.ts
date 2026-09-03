import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Orientační index kvality vody (0-100). Není to oficiální laboratorní ukazatel,
// ale srozumitelný souhrn odvozený od vzdálenosti hodnot od limitů a obvyklých rozsahů.
export function calculateWaterQuality(params: {
  hardness: number; // °dH
  pH: number;
  nitrates: number; // mg/l
  iron?: number; // mg/l
  manganese?: number; // mg/l
}, bacteriological?: {
  ecoli?: number;
  enterococci?: number;
  coliformBacteria?: number;
}): number {
  let score = 96;

  // Tvrdost není hygienický problém sama o sobě, ale mimo obvyklý komfortní rozsah snižuje index.
  if (params.hardness < 7) {
    score -= Math.min(12, (7 - params.hardness) * 2);
  } else if (params.hardness > 14) {
    score -= Math.min(12, (params.hardness - 14) * 1.5);
  }

  // pH se hodnotí podle vzdálenosti od neutrální až slabě zásadité oblasti.
  score -= Math.min(8, Math.abs(params.pH - 7.4) * 2);
  if (params.pH < 6.5) {
    score -= 20 + (6.5 - params.pH) * 10;
  } else if (params.pH > 8.5) {
    score -= 20 + (params.pH - 8.5) * 10;
  }

  // Dusičnany mají hygienický limit 50 mg/l. Index klesá už podle přiblížení k limitu.
  score -= Math.min(10, (params.nitrates / 50) * 6);
  if (params.nitrates > 50) {
    score -= 30;
  } else if (params.nitrates > 25) {
    score -= (params.nitrates - 25) * 0.8;
  }

  // Železo a mangan mají nízké limitní hodnoty; započítáváme i přiblížení k limitu.
  if (typeof params.iron === "number") {
    score -= Math.min(6, (params.iron / 0.2) * 3);
  }
  if (typeof params.iron === "number" && params.iron > 0.2) {
    score -= (params.iron - 0.2) * 50;
  }

  if (typeof params.manganese === "number") {
    score -= Math.min(6, (params.manganese / 0.05) * 3);
  }
  if (typeof params.manganese === "number" && params.manganese > 0.05) {
    score -= (params.manganese - 0.05) * 100;
  }

  if (bacteriological) {
    const hasBacteria =
      (bacteriological.ecoli ?? 0) > 0 ||
      (bacteriological.enterococci ?? 0) > 0 ||
      (bacteriological.coliformBacteria ?? 0) > 0;

    if (hasBacteria) {
      score -= 40;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Funkce pro získání barvy podle skóre
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-fresh-600";
  if (score >= 75) return "text-water-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

// Funkce pro získání popisu podle skóre
export function getScoreLabel(score: number): string {
  if (score >= 90) return "Vynikající";
  if (score >= 75) return "Velmi dobrá";
  if (score >= 60) return "Dobrá";
  if (score >= 40) return "Přijatelná";
  return "Nevyhovující";
}

// Formátování data
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

// Formátování čísla pro Českou korunu
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Formátování čísla
export function formatNumber(num: number, decimals: number = 1): string {
  return new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
