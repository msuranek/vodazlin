"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  MapPin,
  Droplets,
  Users,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { zlínDistricts, waterSources, dataMetadata } from "@/lib/data";
import { formatNumber, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Dynamický import mapy (Leaflet potřebuje window objekt)
const ZlinMap = dynamic(() => import("@/components/ZlinMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-water-50 rounded-xl">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-water-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-earth-600">Načítám mapu...</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState(false);

  const selectedDistrictData = zlínDistricts.find(d => d.id === selectedDistrict);
  const selectedSourceData = waterSources.find(s => s.id === selectedSource);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container-custom py-12">
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
            Mapa kvality vody ve Zlíně
          </h1>
          <p className="text-lg text-earth-700">
            Vyberte městskou část nebo zdroj vody pro zobrazení detailních informací.
          </p>
        </section>

        {/* Mapa a detaily */}
        <section className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Levý panel - Městské části */}
            <div className="lg:col-span-2 space-y-6">
              {/* Zdroje vody */}
              <div>
                <h2 className="text-xl font-mono font-bold text-earth-900 mb-4 flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-water-600" />
                  Úpravny vody
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {waterSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => {
                        setSelectedSource(source.id);
                        setSelectedDistrict(null);
                        setExpandedAreas(false);
                      }}
                      className={cn(
                        "glass-card p-4 text-left transition-all hover:shadow-lg",
                        selectedSource === source.id && "ring-2 ring-water-500 bg-water-50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-mono font-bold text-earth-900">
                            {source.name}
                          </h3>
                          <p className="text-sm text-earth-600 mt-1">
                            {source.waterType}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-mono font-bold text-fresh-600">
                            {source.quality}
                          </span>
                          <p className="text-xs text-earth-500">/100</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-water-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-earth-600">Tvrdost:</span>
                          <span className="font-mono font-medium text-earth-900">
                            {source.hardness} °dH
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Městské části */}
              <div>
                <h2 className="text-xl font-mono font-bold text-earth-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-water-600" />
                  Městské části
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {zlínDistricts.map((district) => {
                    const source = waterSources.find(s => s.id === district.mainSource);
                    return (
                      <button
                        key={district.id}
                        onClick={() => {
                          setSelectedDistrict(district.id);
                          setSelectedSource(null);
                        }}
                        className={cn(
                          "glass-card p-4 text-left transition-all hover:shadow-lg group",
                          selectedDistrict === district.id && "ring-2 ring-water-500 bg-water-50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-mono font-medium text-earth-900 text-sm">
                            {district.name}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-earth-400 group-hover:text-water-600 transition-colors" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              district.quality >= 90 ? "bg-fresh-500" :
                              district.quality >= 75 ? "bg-water-500" :
                              "bg-yellow-500"
                            )}
                          />
                          <span className="text-xs text-earth-600">
                            {district.hardness} °dH
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interaktivní mapa */}
              <div className="glass-card p-4 bg-gradient-to-br from-water-50 to-earth-50">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <ZlinMap
                    selectedSource={selectedSource}
                    selectedDistrict={selectedDistrict}
                    onSelectSource={(id) => {
                      setSelectedSource(id);
                      setSelectedDistrict(null);
                      setExpandedAreas(false);
                    }}
                    onSelectDistrict={(id) => {
                      setSelectedDistrict(id);
                      setSelectedSource(null);
                    }}
                  />
                </div>
                <p className="text-xs text-earth-500 mt-2 text-center">
                  Klikněte na marker nebo barevnou oblast pro zobrazení detailů
                </p>
              </div>
            </div>

            {/* Pravý panel - Detaily */}
            <div>
              <div className="glass-card p-6 sticky top-24">
                {selectedDistrictData ? (
                  <>
                    <h2 className="text-xl font-mono font-bold text-earth-900 mb-4">
                      {selectedDistrictData.name}
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-fresh-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-fresh-100 flex items-center justify-center">
                          <span className="text-xl font-mono font-bold text-fresh-600">
                            {selectedDistrictData.quality}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-earth-900">Kvalita vody</p>
                          <p className="text-sm text-fresh-600">Vynikající</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-water-100">
                          <span className="text-earth-600">Tvrdost vody:</span>
                          <span className="font-mono font-bold text-earth-900">
                            {selectedDistrictData.hardness} °dH
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-water-100">
                          <span className="text-earth-600">Počet obyvatel:</span>
                          <span className="font-mono font-bold text-earth-900">
                            {selectedDistrictData.population.toLocaleString("cs-CZ")}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-earth-600">Zdroj vody:</span>
                          <span className="font-mono font-medium text-water-600">
                            {waterSources.find(s => s.id === selectedDistrictData.mainSource)?.name}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-water-100">
                        <p className="text-sm text-earth-600">
                          <Info className="inline h-4 w-4 mr-1" />
                          Voda v této oblasti je klasifikována jako{" "}
                          <span className="font-medium">
                            {selectedDistrictData.hardness < 10 ? "měkká až středně tvrdá" : "středně tvrdá"}
                          </span>.
                        </p>
                      </div>
                    </div>
                  </>
                ) : selectedSourceData ? (
                  <>
                    <h2 className="text-xl font-mono font-bold text-earth-900 mb-4">
                      {selectedSourceData.name}
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-water-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-water-100 flex items-center justify-center">
                          <Droplets className="h-6 w-6 text-water-600" />
                        </div>
                        <div>
                          <p className="font-medium text-earth-900">Úpravna vody</p>
                          <p className="text-sm text-water-600">{selectedSourceData.waterType}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-water-100">
                          <span className="text-earth-600">Kvalita:</span>
                          <span className="font-mono font-bold text-fresh-600">
                            {selectedSourceData.quality}/100
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-water-100">
                          <span className="text-earth-600">Tvrdost:</span>
                          <span className="font-mono font-bold text-earth-900">
                            {selectedSourceData.hardness} °dH
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-earth-600">Tvrdost (mmol/l):</span>
                          <span className="font-mono font-bold text-earth-900">
                            {selectedSourceData.hardnessMmol} mmol/l
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-water-100">
                        <p className="text-sm font-medium text-earth-900 mb-2">
                          Zásobované oblasti:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(expandedAreas
                            ? selectedSourceData.servesAreas
                            : selectedSourceData.servesAreas.slice(0, 5)
                          ).map((area) => (
                            <span
                              key={area}
                              className="text-xs px-2 py-1 bg-water-50 text-water-700 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                          {selectedSourceData.servesAreas.length > 5 && (
                            <button
                              onClick={() => setExpandedAreas(!expandedAreas)}
                              className="text-xs px-2 py-1 bg-water-100 text-water-700 rounded-full hover:bg-water-200 transition-colors flex items-center gap-1"
                            >
                              {expandedAreas ? (
                                <>
                                  Skrýt
                                  <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  +{selectedSourceData.servesAreas.length - 5} dalších
                                  <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-water-300 mx-auto mb-4" />
                    <p className="text-earth-600 font-medium mb-2">
                      Vyberte lokalitu
                    </p>
                    <p className="text-sm text-earth-500">
                      Klikněte na městskou část nebo úpravnu vody
                      pro zobrazení detailních informací.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Legenda */}
        <section className="container-custom py-8 pb-16">
          <div className="glass-card p-6">
            <h3 className="font-mono font-bold text-earth-900 mb-4">
              Legenda - klasifikace tvrdosti vody
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-water-300" />
                <span className="text-sm text-earth-600">Velmi měkká (&lt;2,8 °dH)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-water-400" />
                <span className="text-sm text-earth-600">Měkká (2,8-7 °dH)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-fresh-500" />
                <span className="text-sm text-earth-600">Středně tvrdá (7-14 °dH)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <span className="text-sm text-earth-600">Tvrdá (14-21 °dH)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm text-earth-600">Velmi tvrdá (&gt;21 °dH)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
