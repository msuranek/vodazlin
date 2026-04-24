# VodaZlín.cz

Webová aplikace poskytující transparentní informace o kvalitě pitné vody ve Zlíně.

## Technologie

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Leaflet** (interaktivní mapa)
- **Docker**

## Spuštění

```bash
cd frontend
docker compose up --build
```

Web běží na `http://localhost:3000`

## Struktura

```
frontend/
├── app/
│   ├── page.tsx              # Hlavní stránka
│   ├── ceny/                 # Ceny a kalkulačka spotřeby
│   ├── kvalita/              # Detail parametrů vody
│   ├── mapa/                 # Interaktivní mapa Zlína
│   └── api/update-data/      # POST endpoint pro aktualizaci dat
├── components/               # WaterScore, ParameterCard, ZlinMap, Header, Footer
└── lib/
    ├── data.ts               # Fallback data
    ├── server-data.ts        # Čte aktuální data z JSON souborů
    └── utils.ts              # Utility funkce
```

## Aktualizace dat

Data (ceny, tvrdost vody) se stahují z [vodarnazlin.cz](https://www.vodarnazlin.cz):

```bash
curl -X POST http://localhost:3000/api/update-data
```

Endpoint stáhne aktuální ceny a tvrdost vody z PDF, uloží je a automaticky refreshne cache stránek.

## Datové zdroje

- [Vodárna Zlín a.s.](https://www.vodarnazlin.cz) — ceny, tvrdost vody

## Licence

MIT
