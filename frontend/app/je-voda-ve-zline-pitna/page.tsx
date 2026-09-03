import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Je voda ve Zlíně pitná? | VodaZlín.cz",
  description: "Srozumitelné vysvětlení, jak číst dostupné údaje o pitné vodě ve Zlíně a co znamenají hlavní parametry.",
};

export default function JeVodaPitnaPage() {
  const quality = getWaterQuality();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Je voda ve Zlíně bezpečná k pití?"
        description="Dostupné hodnoty na tomto webu slouží jako orientační přehled. Pro závazné posouzení jsou rozhodující oficiální rozbory a sdělení provozovatele nebo hygienické stanice."
      >
        <h2>Co ukazují aktuální hodnoty</h2>
        <p>
          Orientační index webu je {quality.score}/100. pH je {formatNumber(quality.parameters.pH, 2)},
          dusičnany {formatNumber(quality.parameters.nitrates)} mg/l a E. coli
          je uvedena jako {quality.bacteriological.ecoli} KTJ/100 ml.
        </p>

        <h2>Co z toho plyne pro domácnost</h2>
        <p>
          Uvedené hodnoty nevypadají jako signál k běžnému vyhýbání se vodě z
          kohoutku. Důležité je ale rozlišovat obecný přehled pro město a přesné
          údaje pro konkrétní odběrné místo.
        </p>

        <h2>Kdy hledat oficiální informaci</h2>
        <p>
          Pokud se objeví zákal, nezvyklý zápach, havárie, výluka nebo doporučení
          vodu nepít, je potřeba sledovat oficiální kanály provozovatele a hygieny.
          Tento web takové oznámení nenahrazuje.
        </p>
        <p>
          Podrobná čísla jsou na stránce <Link href="/kvalita/">kvalita vody</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
