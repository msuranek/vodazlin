// Data o kvalitě vody ve Zlíně
// Zdroje: vodarnazlin.cz, euroclean.cz, pravdaovode.cz
// Poslední aktualizace: leden 2025

export const dataMetadata = {
  lastUpdate: "2025-01-26",
  sources: [
    { name: "Vodárna Zlín a.s.", url: "https://www.vodarnazlin.cz" },
    { name: "EuroClean - tvrdost vody", url: "https://euroclean.cz/problemy-vody/tvrda-voda/zlin/" },
    { name: "Pravda o vodě", url: "https://pravdaovode.cz/cena-vody-zlin/" },
  ],
  updateFrequency: "čtvrtletně",
};

export const currentWaterQuality = {
  timestamp: "2025-01-26T10:00:00Z",
  location: "Zlín - centrální rozvod",
  parameters: {
    hardness: 10.8, // °dH - průměr mezi ÚV Klečůvka (9°dH) a ÚV Tlumačov (12.6°dH)
    pH: 7.4,
    nitrates: 18.5, // mg/l
    iron: 0.08, // mg/l
    manganese: 0.02, // mg/l
    calcium: 64.5, // mg/l
    magnesium: 18.3, // mg/l
    chlorides: 12.8, // mg/l
    sulfates: 28.4, // mg/l
  },
  bacteriological: {
    ecoli: 0, // KTJ/100ml
    enterococci: 0, // KTJ/100ml
    coliformBacteria: 0, // KTJ/100ml
  },
  score: 92, // Vypočítané skóre 0-100
  status: "excellent" as const,
};

// Historická data - průměrné hodnoty pro Zlín
export const historicalData = [
  { date: "2025-01-20", hardness: 10.9, pH: 7.3, nitrates: 19.2, score: 91 },
  { date: "2025-01-15", hardness: 10.7, pH: 7.4, nitrates: 18.8, score: 92 },
  { date: "2025-01-10", hardness: 10.8, pH: 7.5, nitrates: 17.5, score: 93 },
  { date: "2025-01-05", hardness: 11.0, pH: 7.2, nitrates: 19.8, score: 90 },
  { date: "2024-12-30", hardness: 10.6, pH: 7.3, nitrates: 20.1, score: 89 },
  { date: "2024-12-25", hardness: 10.8, pH: 7.4, nitrates: 18.9, score: 92 },
  { date: "2024-12-20", hardness: 10.9, pH: 7.5, nitrates: 17.8, score: 93 },
  { date: "2024-12-15", hardness: 11.1, pH: 7.3, nitrates: 19.5, score: 91 },
  { date: "2024-12-10", hardness: 10.7, pH: 7.2, nitrates: 20.3, score: 88 },
  { date: "2024-12-05", hardness: 10.8, pH: 7.4, nitrates: 18.2, score: 92 },
];

export const waterPricing = {
  lastUpdate: "2025-01-01",
  validFrom: "1. ledna 2025",
  prices: {
    water: {
      price: 61.32, // Kč/m³ bez DPH
      vat: 10, // %
      priceWithVat: 67.45, // Kč/m³ s DPH
    },
    sewage: {
      price: 58.60, // Kč/m³ bez DPH
      vat: 10, // %
      priceWithVat: 64.46, // Kč/m³ s DPH
    },
    total: {
      price: 119.92, // Kč/m³ bez DPH
      priceWithVat: 131.91, // Kč/m³ s DPH
    },
  },
  averageConsumption: {
    person: 95, // l/den
    household2: 58, // m³/rok
    household4: 116, // m³/rok
  },
  source: "https://www.vodarnazlin.cz/zakaznici/cena-vody/cena-vodneho-a-stocneho-2025/",
};

// Hlavní úpravny vody zásobující Zlín
export const waterSources = [
  {
    id: "klecuvka",
    name: "ÚV Klečůvka",
    location: { lat: 49.2456, lng: 17.7234 },
    hardness: 9.0, // °dH (1.62 mmol/l)
    hardnessMmol: 1.62,
    servesAreas: [
      "Východní část Zlína", "Štípa", "Kostelec", "Fryšták",
      "Želechovice nad Dřevnicí", "Lípa nad Dřevnicí", "Březová u Zlína",
      "Lukov", "Zádveřice", "Velíková", "Ostrata", "Hrobice",
      "Veselá", "Lužkovice", "Lukoveček"
    ],
    quality: 93,
    waterType: "měkká až středně tvrdá",
  },
  {
    id: "tlumacov",
    name: "ÚV Tlumačov",
    location: { lat: 49.2678, lng: 17.4987 },
    hardness: 12.6, // °dH (2.26 mmol/l)
    hardnessMmol: 2.26,
    servesAreas: [
      "Západní část Zlína", "Jaroslavice", "Racková", "Březnice u Zlína",
      "Otrokovice", "Napajedla", "Machová", "Mysločovice", "Hostišová",
      "Sazovice", "Tlumačov", "Halenkovice", "Žlutava", "Spytihněv",
      "Lhota u Malenovic", "Salaš u Zlína", "Tečovice", "Bohuslavice u Zlína"
    ],
    quality: 92,
    waterType: "středně tvrdá",
  },
];

export const zlínDistricts = [
  {
    id: "centrum",
    name: "Centrum",
    population: 12500,
    mainSource: "tlumacov",
    quality: 92,
    hardness: 12.6, // ÚV Tlumačov
  },
  {
    id: "jizni-svahy",
    name: "Jižní Svahy",
    population: 18000,
    mainSource: "tlumacov",
    quality: 92,
    hardness: 12.6,
  },
  {
    id: "malenovice",
    name: "Malenovice",
    population: 15800,
    mainSource: "tlumacov",
    quality: 92,
    hardness: 12.6,
  },
  {
    id: "kudlov",
    name: "Kudlov",
    population: 9500,
    mainSource: "klecuvka",
    quality: 93,
    hardness: 9.0, // ÚV Klečůvka
  },
  {
    id: "lesni-ctvrt",
    name: "Lesní čtvrť",
    population: 6800,
    mainSource: "klecuvka",
    quality: 93,
    hardness: 9.0,
  },
  {
    id: "louky",
    name: "Louky",
    population: 8200,
    mainSource: "tlumacov",
    quality: 92,
    hardness: 12.6,
  },
];

export const healthLimits = {
  hardness: { min: 2, max: 50, optimal: [7, 14] as [number, number], unit: "°dH" },
  pH: { min: 6.5, max: 9.5, optimal: [7.0, 8.0] as [number, number], unit: "" },
  nitrates: { min: 0, max: 50, optimal: [0, 25] as [number, number], unit: "mg/l" },
  iron: { min: 0, max: 0.2, optimal: [0, 0.1] as [number, number], unit: "mg/l" },
  manganese: { min: 0, max: 0.05, optimal: [0, 0.02] as [number, number], unit: "mg/l" },
  calcium: { min: 30, max: 150, optimal: [40, 80] as [number, number], unit: "mg/l" },
  magnesium: { min: 10, max: 50, optimal: [10, 30] as [number, number], unit: "mg/l" },
};
