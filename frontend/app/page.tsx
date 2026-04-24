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
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { currentWaterQuality, waterPricing } from "@/lib/data";
import { formatNumber, formatCurrency, formatDate } from "@/lib/utils";

export default function Home() {
  const { parameters, bacteriological, score, timestamp } = currentWaterQuality;
  const lastUpdate = new Date(timestamp);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-water-50 border border-water-200 rounded-full">
                <div className="w-2 h-2 bg-fresh-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-water-900">
                  Aktualizováno {formatDate(lastUpdate)}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-mono font-bold text-earth-900 leading-tight">
                Kvalita pitné vody{" "}
                <span className="text-water-600">ve Zlíně</span>
              </h1>

              <p className="text-lg md:text-xl text-earth-700 leading-relaxed">
                Transparentní přístup k datům o vaší pitné vodě. Sledujte
                kvalitu, tvrdost a další parametry v reálném čase.
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

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5 text-water-600" />
                    <span className="text-sm text-earth-600">Tvrdost</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-earth-900">
                    {formatNumber(parameters.hardness)} °dH
                  </p>
                  <p className="text-xs text-fresh-600 mt-1">Střední voda</p>
                </div>

                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-water-600" />
                    <span className="text-sm text-earth-600">pH</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-earth-900">
                    {formatNumber(parameters.pH, 2)}
                  </p>
                  <p className="text-xs text-fresh-600 mt-1">Ideální</p>
                </div>
              </div>
            </div>

            {/* Right - Score */}
            <div className="flex justify-center animate-slide-up animation-delay-200">
              <WaterScore score={score} size="lg" />
            </div>
          </div>
        </section>

        {/* Key Parameters Section */}
        <section className="container-custom py-16 bg-gradient-to-b from-transparent to-water-50/30">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
              Klíčové parametry
            </h2>
            <p className="text-lg text-earth-700">
              Aktuální měření kvality pitné vody ve Zlíně
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParameterCard
              icon={Droplets}
              label="Tvrdost vody"
              value={formatNumber(parameters.hardness)}
              unit="°dH"
              status="good"
              description="Obsah Ca a Mg iontů"
              limit={{
                min: 2,
                max: 50,
                optimal: [7, 14],
              }}
            />

            <ParameterCard
              icon={Zap}
              label="pH hodnota"
              value={formatNumber(parameters.pH, 2)}
              unit=""
              status="good"
              description="Kyselost/zásaditost"
              limit={{
                min: 6.5,
                max: 9.5,
                optimal: [7.0, 8.0],
              }}
            />

            <ParameterCard
              icon={TrendingUp}
              label="Dusičnany"
              value={formatNumber(parameters.nitrates)}
              unit="mg/l"
              status="good"
              description="NO₃⁻"
              limit={{
                max: 50,
                optimal: [0, 25],
              }}
            />

            <ParameterCard
              icon={Thermometer}
              label="Železo"
              value={formatNumber(parameters.iron, 2)}
              unit="mg/l"
              status="good"
              description="Fe"
              limit={{
                max: 0.2,
                optimal: [0, 0.1],
              }}
            />

            <ParameterCard
              icon={Waves}
              label="Vápník"
              value={formatNumber(parameters.calcium)}
              unit="mg/l"
              status="good"
              description="Ca"
              limit={{
                min: 30,
                max: 150,
                optimal: [40, 80],
              }}
            />

            <ParameterCard
              icon={AlertCircle}
              label="Bakterie"
              value={bacteriological.ecoli}
              unit="KTJ/100ml"
              status="good"
              description="E. coli"
              limit={{
                max: 0,
                optimal: [0, 0],
              }}
            />
          </div>
        </section>

        {/* Price Info Section */}
        <section className="container-custom py-16">
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-mono font-bold text-earth-900 mb-4">
                  Cena vody ve Zlíně
                </h2>
                <p className="text-earth-700 mb-6">
                  Aktuální ceny vodného a stočného platné od{" "}
                  {formatDate(waterPricing.lastUpdate)}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-water-100">
                    <span className="text-earth-700">Vodné (s DPH)</span>
                    <span className="text-2xl font-mono font-bold text-water-600">
                      {formatCurrency(waterPricing.prices.water.priceWithVat)}
                      <span className="text-sm text-earth-600">/m³</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-water-100">
                    <span className="text-earth-700">Stočné (s DPH)</span>
                    <span className="text-2xl font-mono font-bold text-water-600">
                      {formatCurrency(waterPricing.prices.sewage.priceWithVat)}
                      <span className="text-sm text-earth-600">/m³</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="font-mono font-bold text-earth-900">
                      Celkem
                    </span>
                    <span className="text-3xl font-mono font-bold text-earth-900">
                      {formatCurrency(waterPricing.prices.total.priceWithVat)}
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
                      <span className="text-sm text-earth-700">
                        Na osobu / den
                      </span>
                      <span className="font-mono font-bold text-earth-900">
                        {waterPricing.averageConsumption.person} l
                      </span>
                    </div>
                    <div className="h-2 bg-water-200 rounded-full overflow-hidden">
                      <div className="h-full bg-water-600 rounded-full w-2/3"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-water-200">
                    <p className="text-sm text-earth-700 mb-3">
                      Roční náklady domácnosti:
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">2 osoby (58 m³/rok)</span>
                        <span className="font-mono font-bold text-water-600">
                          {formatCurrency(
                            waterPricing.averageConsumption.household2 *
                              waterPricing.prices.total.priceWithVat
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">4 osoby (116 m³/rok)</span>
                        <span className="font-mono font-bold text-water-600">
                          {formatCurrency(
                            waterPricing.averageConsumption.household4 *
                              waterPricing.prices.total.priceWithVat
                          )}
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

        {/* CTA Section */}
        <section className="container-custom py-16">
          <div className="water-gradient rounded-2xl p-12 text-center text-white">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
              Kvalita vody ve vaší části města
            </h2>
            <p className="text-lg mb-8 text-water-50 max-w-2xl mx-auto">
              Podívejte se na interaktivní mapu Zlína a zjistěte kvalitu vody
              přesně ve vaší lokalitě
            </p>
            <Link
              href="/mapa"
              className="inline-block px-8 py-4 bg-white text-water-600 hover:bg-water-50 font-mono font-bold rounded-lg transition-colors shadow-lg"
            >
              Prozkoumat mapu
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
