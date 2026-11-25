# VodaZlín.cz

[![CI and deploy](https://github.com/msuranek/vodazlin/actions/workflows/static-dist.yml/badge.svg?branch=master)](https://github.com/msuranek/vodazlin/actions/workflows/static-dist.yml)
[![vodazlin.cz](https://img.shields.io/website?url=https%3A%2F%2Fvodazlin.cz&label=vodazlin.cz)](https://vodazlin.cz)

Přehled kvality, tvrdosti a ceny pitné vody ve Zlíně postavený nad veřejně dostupnými daty.

**Živý web: [vodazlin.cz](https://vodazlin.cz)**

## Ukázky

### Úvodní přehled

![Úvodní stránka VodaZlín.cz](.github/assets/home.png)

### Mapa zásobovaných oblastí

![Mapa kvality vody ve Zlíně](.github/assets/map.png)

### Detail kvality vody

![Detail kvality pitné vody](.github/assets/quality.png)

## Zdroje dat

Primárním zdrojem je [Vodárna Zlín a.s.](https://www.vodarnazlin.cz), tedy místní provozovatel vodovodu. Projekt automaticky zpracovává:

- zveřejněný ceník vodného a stočného;
- veřejný PDF podklad s hodnotami tvrdosti vody;
- datum a stav poslední úspěšné aktualizace.

Ostatní chemické a mikrobiologické hodnoty na webu slouží jako orientační základ pro vysvětlení jednotlivých ukazatelů. Nejde o živý laboratorní monitoring ani o oficiální službu Vodárny Zlín, hygienické stanice nebo jiné instituce. Orientační skóre kvality je pouze vlastní souhrnný ukazatel webu.

## Zpracování dat

```text
Vodárna Zlín → HTML/PDF scraper → validace a transformace → JSON → Next.js build → statický web
```

Workflow se spouští při pushi do `master`, ručně přes `workflow_dispatch` a automaticky první den v měsíci. Skript stáhne ceník a podklady k tvrdosti vody, zkontroluje očekávaný formát a rozsahy hodnot, aktualizuje JSON snapshoty a vytvoří statický export ve větvi `dist`.

Pokud externí zdroj změní strukturu nebo není dostupný, aktualizace skončí chybou a existující statický web zůstane beze změny.

## Lokální spuštění

```bash
cd frontend
npm ci
npm run dev
```

Vývojový server běží na `http://localhost:3000`.

Statický build se sestaví a naservíruje takto:

```bash
cd frontend
npm run build
npm run start
```

Výstup je ve `frontend/out/`, lokální statický server běží na `http://localhost:8080`.

Docker image servíruje stejný statický export přes nginx:

```bash
cd frontend
docker compose up --build
```

## Aktualizace dat

```bash
cd frontend
npm run update-data
```

Data se stahují z veřejných stránek [Vodárny Zlín](https://www.vodarnazlin.cz) a ukládají do `frontend/content/` (verzováno v gitu):

- `quality/RRRR-Qn.json` – čtvrtletní rozbory kvality vody pro ÚV Tlumačov a ÚV Klečůvka (archiv = historie),
- `documents.json` – rozhodnutí o výjimkách a další dokumenty ke kvalitě vody,
- `hardness-by-municipality.json` – tvrdost vody po obcích,
- `supply-areas.json` – obce zásobované jednotlivými úpravnami,
- `pricing/RRRR.json` – ceník vodného a stočného.

Soubor se přepíše jen tehdy, když nová data projdou validací (limity, rozsahy, kontrola tvrdosti proti Ca + Mg) a obsah se změnil. Build čte jen tato data a síť nepotřebuje. V GitHub Actions běží kontrola jednou týdně a změněná data se automaticky commitnou.

## Testy

```bash
cd frontend
npm test
```

Testy používají uložené fixtures zdrojového HTML a textu extrahovaného z PDF (dva různé layouty kvartálních reportů). Pokrývají výběr reportů, mapování sloupců úpraven, hodnoty pod mezí stanovitelnosti, validaci, ukládání dat a výpočet orientačního skóre.

## Technologie

- **Next.js 14** (App Router, TypeScript, statický export)
- **Tailwind CSS**
- **Leaflet** (interaktivní mapa)
- **Node.js scraper** (`pdf-parse`, Fetch API)
- **GitHub Actions** (testy, týdenní aktualizace dat a publikace)

## Struktura

```text
frontend/
├── app/                     # Stránky a statický export Next.js
├── components/              # Karty, skóre, mapa a layout
├── content/                 # Stažená data Vodárny Zlín (JSON, verzováno)
├── lib/                     # Načítání dat a utility
├── scripts/
│   ├── data-parsers.mjs     # Testovatelné parsery a transformace
│   └── update-data.mjs      # Stažení zdrojů a zápis snapshotů
└── tests/                   # Regresní testy a fixtures
```

## Licence

MIT
