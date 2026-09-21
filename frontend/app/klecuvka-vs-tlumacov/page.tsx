import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterSources } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Klečůvka vs. Tlumačov | VodaZlín.cz",
  description: "Srovnání zdrojů pitné vody Klečůvka a Tlumačov podle tvrdosti, charakteru vody a oblastí zásobování.",
};

export default function KlecuvkaVsTlumacovPage() {
  const sources = getWaterSources();
  const klecuvka = sources.find((source) => source.id === "klecuvka");
  const tlumacov = sources.find((source) => source.id === "tlumacov");

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Klečůvka vs. Tlumačov"
        description="Dvě úpravny v přehledu mají podobně dobré orientační hodnocení, ale liší se tvrdostí vody a oblastmi, které zásobují."
      >
        <h2>Rychlé srovnání</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose my-8">
          {[klecuvka, tlumacov].filter(Boolean).map((source) => (
            <div key={source!.id} className="glass-card p-5">
              <h3 className="text-xl font-mono font-bold text-earth-900 mb-3">
                {source!.name}
              </h3>
              <p className="text-sm text-earth-700 mb-2">
                Tvrdost: {formatNumber(source!.hardness)} °dH
                ({formatNumber(source!.hardnessMmol, 2)} mmol/l)
              </p>
              <p className="text-sm text-earth-700">
                Charakter vody: {source!.waterType}
              </p>
            </div>
          ))}
        </div>

        <h2>Co rozdíl znamená doma</h2>
        <p>
          Rozdíl v tvrdosti se nejvíc projeví při ohřevu vody a v domácích
          spotřebičích. Tvrdší voda může rychleji vytvářet usazeniny, zatímco
          měkčí voda bývá příznivější pro spotřebu mycích prostředků. Ani jedna
          z těchto charakteristik ale sama o sobě neříká, že voda je nebo není
          pitná.
        </p>
        <p>
          Prakticky to znamená, že domácnost napojená na tvrdší vodu bude častěji
          řešit odvápnění konvice, čištění sprchové hlavice a správné dávkování
          soli v myčce. U měkčí až středně tvrdé vody bývá údržba jednodušší, ale
          pořád záleží na spotřebě, teplotě ohřevu a stavu vnitřních rozvodů.
        </p>

        <h2>Proč nestačí jeden průměr pro celý Zlín</h2>
        <p>
          Jedno městské číslo je dobré pro rychlý přehled, ale může zakrýt
          rozdíly mezi částmi sítě. Průměrná tvrdost pomůže návštěvníkovi
          pochopit základní charakter vody, zatímco srovnání zdrojů vysvětluje,
          proč sousední lokalita nemusí mít úplně stejný výsledek.
        </p>
        <p>
          Proto web pracuje se dvěma úrovněmi: souhrnný index a parametry na
          stránce kvality ukazují celkový obraz, zatímco mapa a zdrojové stránky
          pomáhají s praktickým použitím podle místa.
        </p>

        <h2>Proč hodnoty bereme orientačně</h2>
        <p>
          Veřejné podklady se mohou měnit a parser nemusí při každém běhu najít
          všechny hodnoty. Pokud některý zdroj v aktuálním PDF chybí, web ponechá
          předchozí nebo fallback hodnotu a v metodice vysvětluje, co je
          automaticky aktualizované.
        </p>
        <p>
          To je důležité říct otevřeně: tato stránka není laboratorní protokol.
          Je to srozumitelná interpretace dostupných hodnot pro běžného
          návštěvníka. Přidaná hodnota webu je ve spojení čísel, mapy, vysvětlení
          a domácích dopadů, ne v tom, že by nahrazoval provozovatele vodovodu.
        </p>

        <h2>Kdy se dívat na mapu</h2>
        <p>
          Pokud chcete nastavit myčku nebo řešíte vodní kámen, začněte u lokality
          v mapě. Pokud vás zajímá obecné srovnání zdrojů, zůstaňte na této
          stránce. Pokud řešíte aktuální havárii, zákal nebo výluku, použijte
          oficiální informace provozovatele, protože mapa neukazuje mimořádné
          provozní stavy.
        </p>
        <p>
          Více k práci s daty je na stránce{" "}
          <Link href="/o-projektu/">O projektu</Link>. Praktické dopady tvrdosti
          popisuje článek <Link href="/tvrdost-vody-zlin/">tvrdost vody ve Zlíně</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
