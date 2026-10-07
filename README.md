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

## Testy

Unit testy ověřují výpočet orientačního indexu kvality vody, reakci na
bakteriologický nález a hraniční hodnoty popisků a barev:

```bash
cd frontend
npm ci
npm test
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
GitHub Actions workflow `.github/workflows/static-dist.yml` ho spouští při pushi do `master` nebo `main`, ručně přes `workflow_dispatch` a automaticky 1. den v měsíci. Potom vygeneruje čistě statický web do větve `dist`.

## Větve repozitáře

- `master` je aktuální výchozí větev se zdrojovým kódem.
- Workflow přijímá také `main`, aby publikování fungovalo i po případném budoucím přejmenování výchozí větve.
- `dist` je automaticky generovaná větev se statickým webem. Neupravuje se ručně; každý úspěšný build její obsah nahradí.

## Datové zdroje

- [Vodárna Zlín a.s.](https://www.vodarnazlin.cz) — ceny, tvrdost vody

## Licence

[MIT](LICENSE)
