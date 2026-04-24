"use client";

import Link from "next/link";
import { Droplets, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Domů", href: "/" },
    { name: "Kvalita", href: "/kvalita" },
    { name: "Ceny", href: "/ceny" },
    { name: "Mapa", href: "/mapa" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-water-200/50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Droplets className="h-8 w-8 text-water-600 group-hover:text-water-700 transition-colors" />
              <div className="absolute inset-0 bg-water-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-2xl font-mono font-bold text-water-900">
                Voda<span className="text-water-600">Zlín</span>
              </h1>
              <p className="text-xs text-earth-600 font-serif">
                Kvalita pitné vody
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-earth-700 hover:text-water-600 font-mono text-sm font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-water-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-earth-700 hover:text-water-600 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-water-200/50 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-earth-700 hover:text-water-600 font-mono text-sm font-medium transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
