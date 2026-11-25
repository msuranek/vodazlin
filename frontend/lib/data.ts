// Statická data, ke kterým neexistuje strojově čitelný zdroj.
// Měřené hodnoty (kvalita, tvrdost, ceny, zásobované obce) se načítají
// z frontend/content/*.json, které generuje `npm run update-data`.

import type { PlantId } from "./types";

// Poloha úpraven vody (ručně ověřit při změně).
export const plants: { id: PlantId; name: string; location: { lat: number; lng: number } }[] = [
  { id: "tlumacov", name: "ÚV Tlumačov", location: { lat: 49.2678, lng: 17.4987 } },
  { id: "klecuvka", name: "ÚV Klečůvka", location: { lat: 49.2456, lng: 17.7234 } },
];

// Hrubé přiřazení částí Zlína ke zdrojům. Vodárna Zlín uvádí jen
// „východní část Zlína“ (ÚV Klečůvka) a „západní část Zlína“ (ÚV Tlumačov).
export const zlinDistricts: { id: string; name: string; mainSource: PlantId }[] = [
  { id: "centrum", name: "Centrum", mainSource: "tlumacov" },
  { id: "jizni-svahy", name: "Jižní Svahy", mainSource: "tlumacov" },
  { id: "malenovice", name: "Malenovice", mainSource: "tlumacov" },
  { id: "kudlov", name: "Kudlov", mainSource: "klecuvka" },
  { id: "lesni-ctvrt", name: "Lesní čtvrť", mainSource: "klecuvka" },
  { id: "louky", name: "Louky", mainSource: "tlumacov" },
];

// Průměrná spotřeba vody fakturovaná domácnostem ve Zlínském kraji (ČSÚ).
// Aktualizovat ručně jednou ročně po zveřejnění nových dat ČSÚ.
export const averageConsumption = {
  person: 81.0, // l/os/den
  region: "Zlínský kraj",
  year: 2025,
  sourceUrl: "https://csu.gov.cz/vodni-hospodarstvi",
};
