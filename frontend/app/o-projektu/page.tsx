import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getDataMetadata, getWaterQuality } from "@/lib/server-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "O projektu a metodika | VodaZlín.cz",
  description: "Jak VodaZlín.cz pracuje s daty o pitné vodě, odkud pocházejí hodnoty a jak vzniká orientační index kvality vody.",
};

export default function OProjektuPage() {
  const meta = getDataMetadata();
  const quality = getWaterQuality();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="O projektu a metodika"
        description="VodaZlín.cz je nezávislý informační web, který převádí veřejně dostupné údaje o vodě ve Zlíně do srozumitelné podoby pro domácnosti."
      >
        <h2>Co web je a co není</h2>
        <p>
          Cílem webu je pomoci lidem rychle pochopit, jaké hodnoty se u pitné vody
          sledují, co znamenají v běžném životě a kde najít oficiální zdroje.
          Web není oficiální službou provozovatele vodovodu, hygienické stanice
          ani laboratorní protokol.
        </p>
        <p>
          Pro závazné informace je vždy potřeba vycházet z dokumentů provozovatele
          vodovodu, hygienické stanice nebo z vlastního laboratorního rozboru.
        </p>

        <h2>Odkud pocházejí data</h2>
        <p>
          Automaticky se zpracovává veřejný ceník Vodárny Zlín a dostupný
          veřejný podklad s tvrdostí vody. Tyto hodnoty se při pravidelném
          buildu webu znovu načítají a ukládají do statického datového
          snapshotu.
        </p>
        <p>
          Ostatní chemické a mikrobiologické hodnoty v přehledu jsou orientační
          datový základ webu. Slouží k vysvětlení jednotlivých ukazatelů a jejich
          vztahu k limitům, ale nejsou při každém měsíčním běhu scraperu nově
          stahované z laboratorních protokolů.
        </p>
        <h3>Automaticky aktualizujeme</h3>
        <ul>
          <li>cenu vodného a stočného podle zveřejněného ceníku,</li>
          <li>dostupné hodnoty tvrdosti vody z veřejného PDF podkladu, pokud je parser najde,</li>
          <li>metadata o poslední aktualizaci datového snapshotu.</li>
        </ul>
        <h3>Orientační datový základ</h3>
        <ul>
          <li>pH, dusičnany, železo, mangan, vápník, hořčík, chloridy a sírany,</li>
          <li>mikrobiologické ukazatele v přehledu,</li>
          <li>historická tabulka a přiřazení částí města ke zdrojům.</li>
        </ul>
        <ul>
          {meta.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
            </li>
          ))}
        </ul>

        <h2>Jak často se web aktualizuje</h2>
        <p>
          Ceník je kontrolovaný podle zveřejněných cenových údajů, tvrdost vody
          podle dostupných veřejných podkladů. Poslední aktualizace datového
          snapshotu proběhla {formatDate(meta.siteDataUpdatedAt)}.
        </p>
        <p>
          Datum pro kvalitu vody a datum pro ceny neznamená totéž. Ceny se mění
          podle ceníku, zatímco parametry kvality se vyhodnocují podle dostupných
          měření a podkladů.
        </p>

        <h2>Jak vzniká orientační index</h2>
        <p>
          Hodnota {quality.score}/100 je vlastní orientační index VodaZlín.cz.
          Začíná na 96 bodech a klesá podle vzdálenosti vybraných parametrů od
          hygienických limitů a běžně příznivých rozsahů.
        </p>
        <p>
          Do indexu vstupuje tvrdost, pH, dusičnany, železo, mangan a
          mikrobiologické ukazatele. Tvrdost sama o sobě neznamená, že voda je
          zdravotně nevyhovující, ale ovlivňuje komfort v domácnosti, tvorbu
          vodního kamene a nastavení spotřebičů.
        </p>
        <div className="article-note">
          Index je pomůcka pro rychlou orientaci. Není to úřední hodnocení vody
          ani náhrada laboratorního rozboru.
        </div>

        <h2>Jak číst jednotlivé ukazatele</h2>
        <p>
          pH popisuje kyselost nebo zásaditost vody. Dusičnany jsou sledovanou
          chemickou látkou s hygienickým limitem. Železo a mangan mohou při
          vyšších hodnotách ovlivňovat barvu, chuť nebo usazeniny. E. coli a
          enterokoky jsou mikrobiologické ukazatele, u kterých se očekává nulový
          nález.
        </p>
        <p>
          Praktické vysvětlení najdete na stránkách{" "}
          <Link href="/kvalita/">kvalita vody</Link>,{" "}
          <Link href="/tvrdost-vody-zlin/">tvrdost vody ve Zlíně</Link> a{" "}
          <Link href="/dusicnany-v-pitne-vode/">dusičnany v pitné vodě</Link>.
          Kontext zdrojů popisují také stránky{" "}
          <Link href="/zdroje-vody-zlin/">odkud bere Zlín pitnou vodu</Link> a{" "}
          <Link href="/klecuvka-vs-tlumacov/">Klečůvka vs. Tlumačov</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
