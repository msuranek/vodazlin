"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Droplets,
  Calculator,
  Users,
  Home,
  TrendingUp,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import type { waterPricing, dataMetadata } from "@/lib/data";

interface Props {
  pricing: typeof waterPricing;
  meta: typeof dataMetadata;
}

export default function CenyClient({ pricing, meta }: Props) {
  const [persons, setPersons] = useState(2);
  const [customConsumption, setCustomConsumption] = useState<number | null>(null);

  const dailyConsumption = pricing.averageConsumption.person;
  const yearlyConsumptionM3 = customConsumption ?? Math.round((persons * dailyConsumption * 365) / 1000);
  const monthlyConsumptionM3 = yearlyConsumptionM3 / 12;

  const yearlyWaterCost = yearlyConsumptionM3 * pricing.prices.water.priceWithVat;
  const yearlySewageCost = yearlyConsumptionM3 * pricing.prices.sewage.priceWithVat;
  const yearlyTotalCost = yearlyConsumptionM3 * pricing.prices.total.priceWithVat;
  const monthlyCost = yearlyTotalCost / 12;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-grow">
        <section className="container-custom py-12">
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-earth-900 mb-4">
            Ceny vodného a stočného
          </h1>
          <p className="text-lg text-earth-700 mb-4">
            Aktuální ceny vody ve Zlíně platné od {pricing.validFrom}.
          </p>
          <div className="flex items-center gap-2 text-sm text-earth-600">
            <Calendar className="h-4 w-4" />
            <span>Poslední aktualizace: {formatDate(meta.lastUpdate)}</span>
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-water-100">
                  <Droplets className="h-6 w-6 text-water-600" />
                </div>
                <h2 className="font-mono font-bold text-earth-900 text-lg">Vodné</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-earth-600">Cena bez DPH:</span>
                  <span className="font-mono text-earth-900">
                    {formatNumber(pricing.prices.water.price, 2)} Kč/m³
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-earth-600">DPH:</span>
                  <span className="font-mono text-earth-900">{pricing.prices.water.vat} %</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-water-100">
                  <span className="font-medium text-earth-900">Cena s DPH:</span>
                  <span className="font-mono font-bold text-water-600 text-xl">
                    {formatNumber(pricing.prices.water.priceWithVat, 2)} Kč/m³
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-earth-100">
                  <TrendingUp className="h-6 w-6 text-earth-600" />
                </div>
                <h2 className="font-mono font-bold text-earth-900 text-lg">Stočné</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-earth-600">Cena bez DPH:</span>
                  <span className="font-mono text-earth-900">
                    {formatNumber(pricing.prices.sewage.price, 2)} Kč/m³
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-earth-600">DPH:</span>
                  <span className="font-mono text-earth-900">{pricing.prices.sewage.vat} %</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-water-100">
                  <span className="font-medium text-earth-900">Cena s DPH:</span>
                  <span className="font-mono font-bold text-earth-600 text-xl">
                    {formatNumber(pricing.prices.sewage.priceWithVat, 2)} Kč/m³
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-water-50 to-earth-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-fresh-100">
                  <Calculator className="h-6 w-6 text-fresh-600" />
                </div>
                <h2 className="font-mono font-bold text-earth-900 text-lg">Celkem</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-earth-600">Cena bez DPH:</span>
                  <span className="font-mono text-earth-900">
                    {formatNumber(pricing.prices.total.price, 2)} Kč/m³
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-water-100">
                  <span className="font-medium text-earth-900">Cena s DPH:</span>
                  <span className="font-mono font-bold text-fresh-600 text-2xl">
                    {formatNumber(pricing.prices.total.priceWithVat, 2)} Kč/m³
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom py-8">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-water-600" />
              <h2 className="text-2xl font-mono font-bold text-earth-900">
                Kalkulačka nákladů
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    <Users className="inline h-4 w-4 mr-2" />
                    Počet osob v domácnosti
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={persons}
                      onChange={(e) => {
                        setPersons(parseInt(e.target.value));
                        setCustomConsumption(null);
                      }}
                      className="flex-grow h-2 bg-water-200 rounded-lg appearance-none cursor-pointer accent-water-600"
                    />
                    <span className="w-12 text-center font-mono font-bold text-earth-900 text-xl">
                      {persons}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-earth-500 mt-1">
                    <span>1</span>
                    <span>8</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    <Home className="inline h-4 w-4 mr-2" />
                    Roční spotřeba (m³/rok)
                  </label>
                  <input
                    type="number"
                    value={customConsumption ?? yearlyConsumptionM3}
                    onChange={(e) => setCustomConsumption(parseInt(e.target.value) || null)}
                    placeholder={yearlyConsumptionM3.toString()}
                    className="w-full px-4 py-3 border border-water-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-water-500 focus:border-transparent"
                  />
                  <p className="text-xs text-earth-500 mt-1">
                    Průměrná spotřeba: {pricing.averageConsumption.person} l/den/osoba
                  </p>
                </div>

                <button
                  onClick={() => setCustomConsumption(null)}
                  className="text-sm text-water-600 hover:text-water-700 font-medium"
                >
                  Resetovat na průměrnou spotřebu
                </button>
              </div>

              <div className="bg-gradient-to-br from-water-50 to-earth-50 rounded-xl p-6">
                <h3 className="font-mono font-bold text-earth-900 mb-4">
                  Odhadované náklady
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-earth-600">Spotřeba:</span>
                    <span className="font-mono font-bold text-earth-900">
                      {formatNumber(yearlyConsumptionM3, 0)} m³/rok
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-earth-600">Vodné/rok:</span>
                    <span className="font-mono text-water-600">
                      {formatCurrency(yearlyWaterCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-earth-600">Stočné/rok:</span>
                    <span className="font-mono text-earth-600">
                      {formatCurrency(yearlySewageCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-water-200">
                    <span className="font-medium text-earth-900">Celkem/rok:</span>
                    <span className="font-mono font-bold text-fresh-600 text-xl">
                      {formatCurrency(yearlyTotalCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-white rounded-lg px-4">
                    <span className="font-medium text-earth-900">Měsíčně:</span>
                    <span className="font-mono font-bold text-water-600 text-2xl">
                      {formatCurrency(monthlyCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom py-8 pb-16">
          <h2 className="text-2xl font-mono font-bold text-earth-900 mb-6">
            Průměrná spotřeba v ČR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <Users className="h-8 w-8 text-water-600 mx-auto mb-3" />
              <p className="text-3xl font-mono font-bold text-earth-900 mb-1">
                {pricing.averageConsumption.person} l
              </p>
              <p className="text-sm text-earth-600">na osobu za den</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Home className="h-8 w-8 text-water-600 mx-auto mb-3" />
              <p className="text-3xl font-mono font-bold text-earth-900 mb-1">
                {pricing.averageConsumption.household2} m³
              </p>
              <p className="text-sm text-earth-600">2 osoby za rok</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Home className="h-8 w-8 text-water-600 mx-auto mb-3" />
              <p className="text-3xl font-mono font-bold text-earth-900 mb-1">
                {pricing.averageConsumption.household4} m³
              </p>
              <p className="text-sm text-earth-600">4 osoby za rok</p>
            </div>
          </div>
        </section>

        <section className="container-custom pb-16">
          <div className="glass-card p-6 bg-water-50/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-earth-600">Zdroj dat: Vodárna Zlín a.s.</p>
                <p className="text-xs text-earth-500 mt-1">
                  Ceny platné od {pricing.validFrom}
                </p>
              </div>
              <a
                href={pricing.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-water-600 hover:text-water-700 font-medium"
              >
                Oficiální ceník
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
