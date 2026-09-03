import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality, healthLimits } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dusičnany v pitné vodě | VodaZlín.cz",
  description: "Co znamenají dusičnany v pitné vodě, jaký je limit a jak číst aktuální hodnoty ve Zlíně.",
};

export default function DusicnanyPage() {
  const quality = getWaterQuality();
  const value = quality.parameters.nitrates;
  const limit = healthLimits.nitrates.max;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Dusičnany v pitné vodě"
        description="Dusičnany patří mezi důležité chemické ukazatele pitné vody. Sledují se hlavně kvůli hygienickému limitu a citlivějším skupinám obyvatel."
      >
        <h2>Aktuální hodnota ve Zlíně</h2>
        <p>
          V přehledu VodaZlín.cz je uvedeno {formatNumber(value)} mg/l.
          Hygienický limit používaný v přehledu je {formatNumber(limit, 0)} mg/l,
          takže hodnota odpovídá zhruba {formatNumber((value / limit) * 100, 0)} %
          limitu.
        </p>

        <h2>Jak hodnotu číst</h2>
        <p>
          Nižší hodnota vůči limitu znamená větší rezervu. Samotné číslo ale
          vždy patří do kontextu konkrétního odběrného místa, data měření a
          metodiky zdroje.
        </p>

        <h2>Kde najít souvislosti</h2>
        <p>
          Přehled dalších parametrů najdete na stránce{" "}
          <Link href="/kvalita/">kvalita vody</Link>. Shrnutí pro běžného
          návštěvníka je na stránce{" "}
          <Link href="/je-voda-ve-zline-pitna/">je voda ve Zlíně pitná</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
