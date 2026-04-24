# 💧 VodaZlín.cz

Moderní webová aplikace poskytující transparentní informace o kvalitě pitné vody ve Zlíně.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Účel Projektu

VodaZlín.cz je open-source projekt, který:
- ✅ Poskytuje aktuální data o kvalitě pitné vody ve Zlíně
- ✅ Vizualizuje parametry vody přehledně a srozumitelně
- ✅ Umožňuje sledovat trendy a historická data
- ✅ Nabízí kalkulačku ceny vody
- ✅ Zobrazuje kvalitu vody podle částí města

## 🏗️ Technologie

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI**: Custom design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animace**: Framer Motion

### Backend & Data
- **Scraper**: Python 3.11+
- **HTTP**: Requests + BeautifulSoup4
- **Data**: JSON (development) → PostgreSQL (production)

## 📁 Struktura Projektu

```
vodazlin-project/
├── frontend/              # Next.js aplikace
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Domovská stránka
│   │   ├── kvalita/      # Detail kvality vody
│   │   ├── ceny/         # Ceny a kalkulačka
│   │   └── mapa/         # Interaktivní mapa
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── WaterScore.tsx
│   │   └── ParameterCard.tsx
│   └── lib/
│       ├── data.ts       # Mock data
│       └── utils.ts      # Utility funkce
│
├── scraper/              # Python scraper
│   ├── scrapers/
│   │   └── vodarna_zlin.py
│   └── requirements.txt
│
└── docs/                 # Dokumentace
    └── ARCHITECTURE.md
```

## 🚀 Rychlý Start

### Prerekvizity
- Node.js 18+ 
- Python 3.11+
- npm nebo yarn

### Instalace Frontendu

```bash
cd frontend
npm install
npm run dev
```

Aplikace běží na `http://localhost:3000`

### Instalace Scraperu

```bash
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 📊 Datové Zdroje

### Aktuálně Implementované (Mock Data)
- Kvalita vody - základní parametry
- Ceny vodného a stočného
- Bakteriologické rozbory

### Plánované Zdroje
1. **Vodárna Zlín** (vodarnazlin.cz)
   - Rozbory vody
   - Aktuální ceny
   - Informace o vodojemech

2. **KHS Zlínský kraj** (khszlin.cz)
   - Hygienické kontroly
   - Limity a doporučení

3. **ČHMÚ** (chmi.cz)
   - Klimatická data
   - Srážky a sucho

## 🎨 Design Koncept

### Estetika: "Data meets Nature"
- **Barvy**: Vodní modré tóny + zemité hnědé akcenty
- **Typografie**: 
  - Display: Space Mono (technický, datový feel)
  - Body: Crimson Pro (elegance, čitelnost)
- **Animace**: Subtilní vodní efekty
- **Layout**: Čistý, moderní, mobile-first

## 📈 Výpočet Kvality Vody

Skóre kvality (0-100) se počítá podle vzorce:

```typescript
score = 100 - penalties

Penalizace:
- Tvrdost mimo 7-14 °dH
- pH mimo 6.5-8.5
- Dusičnany > 25 mg/l
- Železo > 0.2 mg/l
- Mangan > 0.05 mg/l
```

### Hodnocení
- 90-100: Vynikající
- 75-89: Velmi dobrá
- 60-74: Dobrá
- 40-59: Přijatelná
- 0-39: Nevyhovující

## 🔧 Konfigurace

### Tailwind CSS
Vlastní barevná paleta a utilit y třídy v `tailwind.config.js`

### TypeScript
Plná typová kontrola s `tsconfig.json`

## 📱 Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Scraper (Railway/Fly.io)
```bash
cd scraper
# Nastavit cron job pro pravidelné stahování dat
```

## 🤝 Přispívání

Projekt je open-source! Vítáme pull requesty.

1. Fork projektu
2. Vytvoř feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevři Pull Request

## 📝 Licence

MIT License - viz [LICENSE](LICENSE)

## 👥 Autoři

- Původní návrh a implementace: VodaZlín.cz tým

## 🙏 Poděkování

- Vodárna Zlín a.s. za veřejná data
- KHS Zlínský kraj
- ČHMÚ

## 📧 Kontakt

- Web: [vodazlin.cz](https://vodazlin.cz)
- Email: info@vodazlin.cz
- GitHub: [github.com/vodazlin](https://github.com/vodazlin)

---

**Vytvořeno s 💧 pro občany Zlína**
