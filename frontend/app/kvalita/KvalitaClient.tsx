"use client";

import { useState } from "react";
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
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";
import type { currentWaterQuality, historicalData, waterSources, healthLimits, dataMetadata } from "@/lib/data";

interface Props {
  quality: typeof currentWaterQuality;
  historical: typeof historicalData;
  sources: typeof waterSources;
  limits: typeof healthLimits;
  meta: typeof dataMetadata;
}

export default function KvalitaClient({ quality, historical, sources, limits, meta }: Props) {
  const { parameters, bacteriological, score, timestamp } = quality;
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
                Podrobný přehled všech měřených parametrů pitné vody.
                Data jsou aktualizována {meta.updateFrequency}.
              </p>
              <div className="flex items-center gap-2 text-sm text-earth-600">
                <Calendar className="h-4 w-4" />
                <span>Poslední aktualizace: {formatDate(meta.lastUpdate)}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <WaterScore score={score} size="md" />
            </div>
          </div>
        </section>

        <section className="container-custom py-8">
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
                      {source.hardness} °dH ({source.hardnessMmol} mmol/l)
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
            <ParameterCard icon={Droplets} label="Tvrdost vody" value={formatNumber(parameters.hardness)} unit="°dH" status="good" description="Obsah Ca a Mg iontů" limit={limits.hardness} />
            <ParameterCard icon={Zap} label="pH hodnota" value={formatNumber(parameters.pH, 2)} unit="" status="good" description="Kyselost/zásaditost" limit={limits.pH} />
            <ParameterCard icon={TrendingUp} label="Dusičnany" value={formatNumber(parameters.nitrates)} unit="mg/l" status="good" description="NO₃⁻" limit={limits.nitrates} />
            <ParameterCard icon={Thermometer} label="Železo" value={formatNumber(parameters.iron, 2)} unit="mg/l" status="good" description="Fe" limit={limits.iron} />
            <ParameterCard icon={Thermometer} label="Mangan" value={formatNumber(parameters.manganese, 2)} unit="mg/l" status="good" description="Mn" limit={limits.manganese} />
            <ParameterCard icon={Waves} label="Vápník" value={formatNumber(parameters.calcium)} unit="mg/l" status="good" description="Ca" limit={limits.calcium} />
            <ParameterCard icon={Waves} label="Hořčík" value={formatNumber(parameters.magnesium)} unit="mg/l" status="good" description="Mg" limit={limits.magnesium} />
            <ParameterCard icon={Beaker} label="Chloridy" value={formatNumber(parameters.chlorides)} unit="mg/l" status="good" description="Cl⁻" limit={{ max: 250, optimal: [0, 100] }} />
            <ParameterCard icon={Beaker} label="Sírany" value={formatNumber(parameters.sulfates)} unit="mg/l" status="good" description="SO₄²⁻" limit={{ max: 250, optimal: [0, 150] }} />
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-fresh-600" />
            <h2 className="text-2xl font-mono font-bold text-earth-900">Bakteriologické parametry</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ParameterCard icon={AlertCircle} label="E. coli" value={bacteriological.ecoli} unit="KTJ/100ml" status="good" description="Escherichia coli" limit={{ max: 0, optimal: [0, 0] }} />
            <ParameterCard icon={AlertCircle} label="Enterokoky" value={bacteriological.enterococci} unit="KTJ/100ml" status="good" description="Intestinální enterokoky" limit={{ max: 0, optimal: [0, 0] }} />
            <ParameterCard icon={AlertCircle} label="Koliformní bakterie" value={bacteriological.coliformBacteria} unit="KTJ/100ml" status="good" description="Celkové koliformní bakterie" limit={{ max: 0, optimal: [0, 0] }} />
          </div>
        </section>

        <section className="container-custom py-8 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-water-600" />
            <h2 className="text-2xl font-mono font-bold text-earth-900">Historie měření</h2>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-water-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-mono font-bold text-earth-900">Datum</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Tvrdost (°dH)</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">pH</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Dusičnany (mg/l)</th>
                    <th className="px-4 py-3 text-right text-sm font-mono font-bold text-earth-900">Skóre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-water-100">
                  {historical.map((row, index) => (
                    <tr key={index} className="hover:bg-water-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-earth-700">{formatDate(row.date)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{formatNumber(row.hardness)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{formatNumber(row.pH, 1)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-earth-900">{formatNumber(row.nitrates)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className="font-mono font-bold text-fresh-600">{row.score}</span>
                      </td>
                    </tr>
                  ))}
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
                  Data o kvalitě vody jsou získávána z veřejně dostupných zdrojů
                  a aktualizována {meta.updateFrequency}.
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
