"use client";

import { Droplets, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-card border-t border-water-200/50 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Popis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-6 w-6 text-water-600" />
              <span className="text-xl font-mono font-bold text-water-900">
                VodaZlín.cz
              </span>
            </div>
            <p className="text-sm text-earth-600 leading-relaxed">
              Transparentní informace o kvalitě pitné vody ve Zlíně. 
              Open-source projekt s daty z veřejných zdrojů.
            </p>
          </div>

          {/* Rychlé odkazy */}
          <div>
            <h3 className="font-mono font-bold text-earth-900 mb-4">
              Rychlé odkazy
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/kvalita"
                  className="text-sm text-earth-600 hover:text-water-600 transition-colors"
                >
                  Kvalita vody
                </Link>
              </li>
              <li>
                <Link
                  href="/ceny"
                  className="text-sm text-earth-600 hover:text-water-600 transition-colors"
                >
                  Ceny a kalkulačka
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa"
                  className="text-sm text-earth-600 hover:text-water-600 transition-colors"
                >
                  Mapa Zlína
                </Link>
              </li>
              <li>
                <Link
                  href="/o-projektu"
                  className="text-sm text-earth-600 hover:text-water-600 transition-colors"
                >
                  O projektu a metodika
                </Link>
              </li>
            </ul>
          </div>

          {/* Zdroje dat */}
          <div>
            <h3 className="font-mono font-bold text-earth-900 mb-4">
              Související zdroje
            </h3>
            <ul className="space-y-2 text-sm text-earth-600">
              <li>
                <a
                  href="https://www.vodarnazlin.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-water-600 transition-colors"
                >
                  Vodárna Zlín a.s.
                </a>
              </li>
              <li>
                <a
                  href="https://www.khszlin.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-water-600 transition-colors"
                >
                  KHS Zlínský kraj
                </a>
              </li>
              <li>
                <a
                  href="https://www.chmi.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-water-600 transition-colors"
                >
                  ČHMÚ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-water-200/50 mt-8 pt-8">
          <h3 className="font-mono font-bold text-earth-900 mb-4">
            Praktické články
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ["Tvrdost vody ve Zlíně", "/tvrdost-vody-zlin"],
              ["Vodní kámen", "/vodni-kamen"],
              ["Nastavení myčky", "/nastaveni-mycky"],
              ["Dusičnany v pitné vodě", "/dusicnany-v-pitne-vode"],
              ["Je voda ve Zlíně pitná?", "/je-voda-ve-zline-pitna"],
              ["Jak se kontroluje pitná voda", "/jak-se-kontroluje-pitna-voda"],
              ["Zdroje vody ve Zlíně", "/zdroje-vody-zlin"],
              ["Klečůvka vs. Tlumačov", "/klecuvka-vs-tlumacov"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-earth-600 hover:text-water-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-water-200/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-earth-600">
            © {currentYear} VodaZlín.cz • Open Data • MIT License
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/zasady-ochrany-soukromi"
              className="text-sm text-earth-600 hover:text-water-600 transition-colors"
            >
              Soukromí
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-earth-600 hover:text-water-600 transition-colors"
            >
              Cookies
            </Link>
            <a
              href="mailto:info@vodazlin.cz"
              className="text-earth-600 hover:text-water-600 transition-colors flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm">info@vodazlin.cz</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
