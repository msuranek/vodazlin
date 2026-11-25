"use client";

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
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { formatNumber, formatCurrency, formatDate } from "@/lib/utils";
import { PARAMETER_META, describeLimit, formatPeriod } from "@/lib/report-display";
import type { DataMetadata, ParameterKey, PlantSummary, QualityReport, WaterPricing } from "@/lib/types";

interface Props {
  report: QualityReport;
  sources: PlantSummary[];
  allWithinLimits: boolean;
  pricing: WaterPricing;
  meta: DataMetadata;
}

const KEY_PARAMETERS: { key: ParameterKey; icon: typeof Droplets }[] = [
  { key: "hardness", icon: Droplets },
  { key: "pH", icon: Zap },
  { key: "nitrates", icon: TrendingUp },
  { key: "iron", icon: Thermometer },
  { key: "calcium", icon: Waves },
  { key: "ecoli", icon: AlertCircle },
];

export default function HomeClient({ report, sources, allWithinLimits, pricing, meta }: Props) {
  const period = formatPeriod(report.period);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-grow">
        <section className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-water-50 border border-water-200 rounded-full">
                <div className="w-2 h-2 bg-fresh-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-water-900">
                  Rozbor za {period} · data načtena {formatDate(report.updatedAt)}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-mono font-bold text-earth-900 leading-tight">
                Kvalita pitné vody{" "}
                <span className="text-water-600">ve Zlíně</span>
              </h1>

              <p className="text-lg md:text-xl text-earth-700 leading-relaxed">
                {allWithinLimits
                  ? `Voda z úpraven Tlumačov a Klečůvka vyhověla v rozboru za ${period} všem hygienickým limitům.`
                  : `V rozboru za ${period} překročil některý ukazatel hygienický limit. Podrobnosti najdete v detailním rozboru.`}{" "}
                Hodnoty přebíráme z veřejných rozborů Vodárny Zlín.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/kvalita" className="btn-primary">
                  Detailní rozbor
                </Link>
                <Link
                  href="/mapa"
                  className="px-6 py-3 bg-white border-2 border-water-600 text-water-600 hover:bg-water-50 font-mono rounded-lg transition-all duration-200"
                >
                  Mapa Zlína
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                {sources.map((source) => (
                  <div key={source.id} className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-water-600" />
                      <span className="text-sm text-earth-600">Tvrdost · {source.name}</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-earth-900">
                      {formatNumber(source.hardness)} °dH
                    </p>
                    <p className="text-xs text-fresh-600 mt-1">{source.waterType}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center animate-slide-up animation-delay-200">
              <div className="flex flex-wrap justify-center gap-8">
                {sources.map((source) => (
                  <div key={source.id} className="text-center">
                    <WaterScore score={source.quality} size="md" />
                    <p className="mt-2 font-mono font-bold text-earth-900">{source.name}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-sm text-sm text-earth-600 text-center leading-relaxed">
                Skóre je vlastní orientační index VodaZlín.cz spočítaný z rozboru
                za {period}. Nenahrazuje oficiální hodnocení; jak vzniká, popisuje
                stránka <Link href="/o-projektu/" className="underline underline-offset-4">O projektu</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="container-custom py-16 bg-gradient-to-b from-transparent to-water-50/30">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
              Klíčové parametry
            </h2>
            <p className="text-lg text-earth-700">
              Výsledky rozboru Vodárny Zlín za {period}.{" "}
              <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-water-700 underline underline-offset-4">
                Zdrojový dokument (PDF)
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_PARAMETERS.map(({ key, icon }) => {
              const meta = PARAMETER_META[key];
              return (
                <ParameterCard
                  key={key}
                  icon={icon}
                  label={meta.label}
                  description={meta.description}
                  unit={meta.unit}
                  values={sources.map((source) => ({
                    label: source.name,
                    value: report.plants[source.id][key].raw,
                  }))}
                  limit={describeLimit(report.limits[key], meta.unit)}
                />
              );
            })}
          </div>
        </section>

        <section className="container-custom py-16">
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-mono font-bold text-earth-900 mb-4">
                  Cena vody ve Zlíně
                </h2>
                <p className="text-earth-700 mb-6">
                  Aktuální ceny vodného a stočného platné od{" "}
                  {pricing.validFrom}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-water-100">
                    <span className="text-earth-700">Vodné (s DPH)</span>
                    <span className="text-2xl font-mono font-bold text-water-600">
                      {formatCurrency(pricing.prices.water.priceWithVat)}
                      <span className="text-sm text-earth-600">/m³</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-water-100">
                    <span className="text-earth-700">Stočné (s DPH)</span>
                    <span className="text-2xl font-mono font-bold text-water-600">
                      {formatCurrency(pricing.prices.sewage.priceWithVat)}
                      <span className="text-sm text-earth-600">/m³</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-mono font-bold text-earth-900">Celkem</span>
                    <span className="text-3xl font-mono font-bold text-earth-900">
                      {formatCurrency(pricing.prices.total.priceWithVat)}
                      <span className="text-sm text-earth-600">/m³</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-water-50 rounded-xl p-6">
                <h3 className="text-xl font-mono font-bold text-earth-900 mb-4">
                  Průměrná spotřeba
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-earth-700">Na osobu / den</span>
                      <span className="font-mono font-bold text-earth-900">
                        {pricing.averageConsumption.person} l
                      </span>
                    </div>
                    <div className="h-2 bg-water-200 rounded-full overflow-hidden">
                      <div className="h-full bg-water-600 rounded-full w-2/3"></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-water-200">
                    <p className="text-sm text-earth-700 mb-3">Roční náklady domácnosti:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">2 osoby ({pricing.averageConsumption.household2} m³/rok)</span>
                        <span className="font-mono font-bold text-water-600">
                          {formatCurrency(pricing.averageConsumption.household2 * pricing.prices.total.priceWithVat)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">4 osoby ({pricing.averageConsumption.household4} m³/rok)</span>
                        <span className="font-mono font-bold text-water-600">
                          {formatCurrency(pricing.averageConsumption.household4 * pricing.prices.total.priceWithVat)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/ceny"
                  className="block w-full text-center mt-6 px-6 py-3 bg-water-600 hover:bg-water-700 text-white font-mono rounded-lg transition-colors"
                >
                  Kalkulačka spotřeby
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom py-16">
          <div className="water-gradient rounded-2xl p-12 text-center text-white">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
              Kvalita vody ve vaší části města
            </h2>
            <p className="text-lg mb-8 text-water-50 max-w-2xl mx-auto">
              Podívejte se na mapu Zlína a zjistěte, ze které úpravny je vaše
              lokalita zásobovaná a jakou tvrdost tam voda má
            </p>
            <Link
              href="/mapa"
              className="inline-block px-8 py-4 bg-white text-water-600 hover:bg-water-50 font-mono font-bold rounded-lg transition-colors shadow-lg"
            >
              Prozkoumat mapu
            </Link>
          </div>
        </section>

        <section className="container-custom py-16">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
              Praktické informace o vodě ve Zlíně
            </h2>
            <p className="text-lg text-earth-700 max-w-3xl">
              Čísla v přehledu doplňujeme vysvětlením, aby bylo jasné, co
              znamenají pro běžné používání vody v domácnosti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Tvrdost vody ve Zlíně", "/tvrdost-vody-zlin", "Co znamená hodnota °dH a proč se liší podle zdroje."],
              ["Vodní kámen", "/vodni-kamen", "Jak tvrdost souvisí s usazeninami a údržbou spotřebičů."],
              ["Nastavení myčky", "/nastaveni-mycky", "Jak použít tvrdost vody při nastavení změkčovače."],
              ["Dusičnany v pitné vodě", "/dusicnany-v-pitne-vode", "Jak číst hodnotu vůči hygienickému limitu."],
              ["Je voda ve Zlíně pitná?", "/je-voda-ve-zline-pitna", "Srozumitelné shrnutí dostupných hodnot a jejich limitů."],
              ["Jak se kontroluje pitná voda", "/jak-se-kontroluje-pitna-voda", "Proč záleží na místě odběru, datu a typu ukazatele."],
              ["Zdroje vody ve Zlíně", "/zdroje-vody-zlin", "Odkud může voda pocházet a proč se lokality liší."],
              ["Klečůvka vs. Tlumačov", "/klecuvka-vs-tlumacov", "Srovnání tvrdosti a charakteru vody u hlavních zdrojů."],
            ].map(([title, href, text]) => (
              <Link key={href} href={href} className="glass-card p-5 block hover:shadow-xl transition-all">
                <h3 className="text-lg font-mono font-bold text-earth-900 mb-2">{title}</h3>
                <p className="text-sm text-earth-700 leading-relaxed">{text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
