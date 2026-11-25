"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WaterScore from "@/components/WaterScore";
import ParameterCard from "@/components/ParameterCard";
import {
  Droplets,
  TrendingUp,
  AlertCircle,
  Thermometer,
  Waves,
  Zap,
  Beaker,
  Shield,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PARAMETER_META, describeLimit, formatPeriod, formatPeriodShort } from "@/lib/report-display";
import type { DataMetadata, ParameterKey, PlantId, PlantSummary, QualityDocument, QualityReport } from "@/lib/types";

interface HistoryRow {
  period: string;
  title: string;
  sourceUrl: string;
  plants: { id: PlantId; hardness: string; pH: string; nitrates: string; iron: string; score: number }[];
}

interface Props {
  report: QualityReport;
  history: HistoryRow[];
  sources: PlantSummary[];
  documents: QualityDocument[];
  allWithinLimits: boolean;
  meta: DataMetadata;
}

const CHEMICAL: { key: ParameterKey; icon: typeof Droplets }[] = [
  { key: "nitrates", icon: TrendingUp },
  { key: "iron", icon: Thermometer },
  { key: "manganese", icon: Thermometer },
  { key: "hardness", icon: Droplets },
  { key: "calcium", icon: Waves },
  { key: "magnesium", icon: Waves },
  { key: "pH", icon: Zap },
];

const BACTERIA: ParameterKey[] = ["ecoli", "enterococci", "coliformBacteria"];

export default function KvalitaClient({ report, history, sources, documents, allWithinLimits, meta }: Props) {
  const period = formatPeriod(report.period);
  const plantName = (id: PlantId) => sources.find((source) => source.id === id)?.name ?? id;
  const card = (key: ParameterKey, icon: typeof Droplets) => {
    const info = PARAMETER_META[key];
    return (
      <ParameterCard
        key={key}
        icon={icon}
        label={info.label}
        description={info.description}
        unit={info.unit}
        values={sources.map((source) => ({ label: source.name, value: report.plants[source.id][key].raw }))}
        limit={describeLimit(report.limits[key], info.unit)}
      />
    );
  };
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-grow">
        <section className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
                Kvalita pitné vody ve Zlíně
              </h1>
              <p className="text-lg text-earth-700 mb-6">
                Výsledky čtvrtletního rozboru Vodárny Zlín za {period} pro obě
                úpravny, které zásobují Zlín.{" "}
                {allWithinLimits
                  ? "Všechny sledované ukazatele jsou v hygienických limitech."
                  : "Některý ukazatel překročil hygienický limit – řiďte se pokyny Vodárny Zlín a hygienické stanice."}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-earth-600">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data načtena {formatDate(report.updatedAt)}
                </span>
                <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-water-700 underline underline-offset-4">
                  <FileText className="h-4 w-4" />
                  {report.title} (PDF)
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex gap-6">
                {sources.map((source) => (
                  <div key={source.id} className="text-center">
                    <WaterScore score={source.quality} size="md" />
                    <p className="mt-2 text-sm font-mono font-bold text-earth-900">{source.name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 max-w-xs text-xs text-earth-600 text-center leading-relaxed">
                Orientační index webu z rozboru za {period}. Není to oficiální
                hodnocení.
              </p>
            </div>
          </div>
        </section>

        {documents.length > 0 && (
          <section className="container-custom pb-4">
            <div className="glass-card p-5 border border-yellow-200 bg-yellow-50/60">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-mono font-bold text-earth-900 mb-2">
                    Výjimky a další dokumenty Vodárny Zlín
                  </h2>
                  <p className="text-sm text-earth-700 mb-3">
                    Pro některé lokality platí rozhodnutí hygienické stanice o
                    výjimce nebo samostatné výsledky rozborů. Týkají se konkrétních
                    míst, ne celé sítě.
                  </p>
                  <ul className="space-y-1">
                    {documents.map((doc) => (
                      <li key={doc.url}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-water-700 underline underline-offset-4">
                          {doc.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container-custom py-8">
          <div className="max-w-4xl mb-10">
            <h2 className="text-2xl font-mono font-bold text-earth-900 mb-4">
              Jak číst výsledky kvality vody
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-earth-700 leading-relaxed">
              <p>
                Jednotlivé hodnoty je potřeba číst podle jednotek a limitů.
                Některé parametry, například E. coli nebo enterokoky, mají
                hygienický význam okamžitě. Jiné, například tvrdost, více
                ovlivňují chuť vody a provoz domácích spotřebičů.
              </p>
              <p>
                Hodnoty jsou převzaté z rozboru tak, jak je uvádí laboratoř.
                Zápis „&lt;0,02“ znamená, že látka byla pod mezí stanovitelnosti.
                Orientační index shrnuje vybrané parametry do jednoho čísla,
                ale závazný je vždy konkrétní rozbor a oficiální informace.
                Podrobnější popis výpočtu je na stránce{" "}
                <Link href="/o-projektu/" className="text-water-700 underline underline-offset-4">
                  O projektu
                </Link>.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-mono font-bold text-earth-900 mb-6">
            Zdroje pitné vody
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source) => (
              <div key={source.id} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-water-100">
                    <Droplets className="h-6 w-6 text-water-600" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-earth-900">{source.name}</h3>
                    <p className="text-sm text-earth-600">{source.waterType}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-earth-600">Tvrdost vody:</span>
                    <span className="font-mono font-bold text-earth-900">
                      {source.hardness.toLocaleString("cs-CZ")} °dH ({source.hardnessMmol.toLocaleString("cs-CZ")} mmol/l)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Kvalita:</span>
                    <span className="font-mono font-bold text-fresh-600">
                      {source.quality}/100
                    </span>
                  </div>
                  <div className="pt-3 border-t border-water-100">
                    <p className="text-sm text-earth-600 mb-2">Zásobované oblasti:</p>
                    <div className="flex flex-wrap gap-1">
                      {(expandedSource === source.id
                        ? source.servesAreas
                        : source.servesAreas.slice(0, 5)
                      ).map((area) => (
                        <span
                          key={area}
                          className="text-xs px-2 py-1 bg-water-50 text-water-700 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                      {source.servesAreas.length > 5 && (
                        <button
                          onClick={() =>
                            setExpandedSource(expandedSource === source.id ? null : source.id)
                          }
                          className="text-xs px-2 py-1 bg-water-100 text-water-700 rounded-full hover:bg-water-200 transition-colors flex items-center gap-1"
                        >
                          {expandedSource === source.id ? (
                            <>Skrýt <ChevronUp className="h-3 w-3" /></>
                          ) : (
                            <>+{source.servesAreas.length - 5} dalších <ChevronDown className="h-3 w-3" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <Beaker className="h-6 w-6 text-water-600" />
            <h2 className="text-2xl font-mono font-bold text-earth-900">Chemické parametry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHEMICAL.map(({ key, icon }) => card(key, icon))}
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h2 className="text-2xl font-mono font-bold text-earth-900 mb-4">
                Co znamenají hlavní parametry
              </h2>
              <p className="text-earth-700 leading-relaxed">
                Hodnoty v tabulkách dávají smysl až ve vztahu k limitu,
                doporučenému rozsahu a účelu parametru.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-card p-5">
                <h3 className="text-lg font-mono font-bold text-earth-900 mb-2">Tvrdost vody</h3>
                <p className="text-sm text-earth-700 leading-relaxed">
                  Vyjadřuje obsah vápníku a hořčíku. Středně tvrdá voda je běžná,
                  ale může tvořit vodní kámen. Více na stránce{" "}
                  <Link href="/tvrdost-vody-zlin/" className="text-water-700 underline underline-offset-4">
                    tvrdost vody ve Zlíně
                  </Link>.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-lg font-mono font-bold text-earth-900 mb-2">pH</h3>
                <p className="text-sm text-earth-700 leading-relaxed">
                  Popisuje kyselost nebo zásaditost vody. Pitná voda má být v
                  povoleném rozsahu; malé rozdíly uvnitř něj obvykle nejsou samy
                  o sobě problém.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-lg font-mono font-bold text-earth-900 mb-2">Dusičnany</h3>
                <p className="text-sm text-earth-700 leading-relaxed">
                  Sledují se vůči limitu 50 mg/l. Důležité jsou hlavně pro
                  citlivější skupiny obyvatel. Více vysvětluje stránka{" "}
                  <Link href="/dusicnany-v-pitne-vode/" className="text-water-700 underline underline-offset-4">
                    dusičnany v pitné vodě
                  </Link>.
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-lg font-mono font-bold text-earth-900 mb-2">Mikrobiologie</h3>
                <p className="text-sm text-earth-700 leading-relaxed">
                  U E. coli a enterokoků se očekává nulový nález. Při nenulovém
                  nálezu je nutné řídit se oficiálními pokyny provozovatele nebo
                  hygienické stanice.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-fresh-600" />
            <h2 className="text-2xl font-mono font-bold text-earth-900">Bakteriologické parametry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BACTERIA.map((key) => card(key, AlertCircle))}
          </div>
        </section>

        <section className="container-custom py-8 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-water-600" />
            <h2 className="text-2xl font-mono font-bold text-earth-900">Historie měření</h2>
          </div>
          <p className="text-earth-700 mb-4">
            Archiv čtvrtletních rozborů Vodárny Zlín. Každý řádek vede na
            zdrojový dokument.
          </p>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-water-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-mono font-bold text-earth-900">Období</th>
                    <th className="px-4 py-3 text-left text-sm font-mono font-bold text-earth-900">Úpravna</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Tvrdost (mmol/l)</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">pH</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Dusičnany (mg/l)</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Železo (mg/l)</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-water-100">
                  {history.flatMap((row) =>
                    row.plants.map((plant, index) => (
                      <tr key={`${row.period}-${plant.id}`} className="hover:bg-water-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-earth-700">
                          {index === 0 && (
                            <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-water-700 underline underline-offset-4">
                              {formatPeriodShort(row.period)}
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-earth-700">{plantName(plant.id)}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{plant.hardness}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{plant.pH}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{plant.nitrates}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{plant.iron}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="font-mono font-bold text-fresh-600">{plant.score}</span>
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="container-custom pb-16">
          <div className="glass-card p-6 bg-water-50/50">
            <div className="flex gap-4">
              <Info className="h-6 w-6 text-water-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono font-bold text-earth-900 mb-2">O datech</h3>
                <p className="text-sm text-earth-700 mb-3">
                  Data stahujeme automaticky z veřejných dokumentů Vodárny Zlín.
                  Web jednou týdně kontroluje, zda nevyšel nový rozbor; Vodárna
                  je zveřejňuje čtvrtletně.
                </p>
                <div className="flex flex-wrap gap-2">
                  {meta.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 bg-white border border-water-200 text-water-700 rounded-full hover:bg-water-100 transition-colors"
                    >
                      {source.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
