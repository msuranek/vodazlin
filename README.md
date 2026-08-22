# VodaZlín.cz

Webová aplikace poskytující transparentní informace o kvalitě pitné vody ve Zlíně.

## Technologie

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Leaflet** (interaktivní mapa)
- **GitHub Actions** (měsíční aktualizace dat a statický export)

## Spuštění

```bash
cd frontend
npm install
npm run dev
```

Web běží na `http://localhost:3000`

Statický build:

```bash
cd frontend
npm run update-data
npm run build
npm run start
```

Výstup je ve `frontend/out/`, lokální statický server běží na `http://localhost:8080`.

Docker image také servíruje jen statické soubory přes nginx:

```bash
cd frontend
docker compose up --build
```

## Struktura

```
frontend/
├── app/
│   ├── page.tsx              # Hlavní stránka
│   ├── ceny/                 # Ceny a kalkulačka spotřeby
│   ├── kvalita/              # Detail parametrů vody
│   ├── mapa/                 # Interaktivní mapa Zlína
├── components/               # WaterScore, ParameterCard, ZlinMap, Header, Footer
├── scripts/
│   └── update-data.mjs       # Měsíční scraper pro GitHub Actions
└── lib/
    ├── data.ts               # Fallback data
    ├── server-data.ts        # Čte aktuální data z JSON souborů
    └── utils.ts              # Utility funkce
```

## Aktualizace dat

Data (ceny, tvrdost vody) se stahují z [vodarnazlin.cz](https://www.vodarnazlin.cz) při buildu:

```bash
cd frontend
npm run update-data
```

Skript stáhne aktuální ceny a tvrdost vody z PDF a uloží JSON soubory do `frontend/data/`.
GitHub Actions workflow `.github/workflows/static-dist.yml` ho spouští při pushi do `main`, ručně přes `workflow_dispatch` a automaticky 1. den v měsíci. Potom vygeneruje čistě statický web do větve `dist`.

## Datové zdroje

- [Vodárna Zlín a.s.](https://www.vodarnazlin.cz) — ceny, tvrdost vody

## Licence

MIT
