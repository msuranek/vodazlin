import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funkce pro výpočet kvality vody (0-100)
export function calculateWaterQuality(params: {
  hardness: number; // °dH
  pH: number;
  nitrates: number; // mg/l
  iron?: number; // mg/l
  manganese?: number; // mg/l
}): number {
  let score = 100;

  // Tvrdost (ideál 7-14 °dH)
  if (params.hardness < 7) {
    score -= (7 - params.hardness) * 3;
  } else if (params.hardness > 14) {
    score -= (params.hardness - 14) * 2;
  }

  // pH (ideál 6.5-8.5)
  if (params.pH < 6.5) {
    score -= (6.5 - params.pH) * 10;
  } else if (params.pH > 8.5) {
    score -= (params.pH - 8.5) * 10;
  }

  // Dusičnany (limit 50 mg/l, ideál < 25)
  if (params.nitrates > 50) {
    score -= 30;
  } else if (params.nitrates > 25) {
    score -= (params.nitrates - 25) * 0.8;
  }

  // Železo (limit 0.2 mg/l)
  if (params.iron && params.iron > 0.2) {
    score -= (params.iron - 0.2) * 50;
  }

  // Mangan (limit 0.05 mg/l)
  if (params.manganese && params.manganese > 0.05) {
    score -= (params.manganese - 0.05) * 100;
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
