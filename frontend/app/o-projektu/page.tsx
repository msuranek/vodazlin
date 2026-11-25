import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getDataMetadata, getWaterSources } from "@/lib/server-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "O projektu a metodika | VodaZlín.cz",
  description: "Jak VodaZlín.cz pracuje s daty o pitné vodě, odkud pocházejí hodnoty a jak vzniká orientační index kvality vody.",
};

export default function OProjektuPage() {
  const meta = getDataMetadata();
  const sources = getWaterSources();

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
        <p>
          Přidaná hodnota webu je v interpretaci. Veřejná čísla sama o sobě často
          neřeknou, jestli má člověk upravit nastavení myčky, proč se tvoří vodní
          kámen nebo proč se tvrdost může lišit podle části města. VodaZlín.cz
          proto spojuje datový přehled, mapu a praktické texty pro domácnosti.
        </p>

        <h2>Odkud pocházejí data</h2>
        <p>
          Všechna měřená čísla na webu pocházejí z veřejných dokumentů Vodárny
          Zlín a stahují se automaticky. U hodnot uvádíme úpravnu vody, období
          rozboru a odkaz na zdrojový dokument.
        </p>
        <ul>
          <li>
            <strong>Kvalita vody</strong> – čtvrtletní tabulky „Kvalita pitné
            vody na Zlínsku“ s výsledky pro ÚV Tlumačov a ÚV Klečůvka (dusičnany,
            bakterie, železo, mangan, tvrdost, vápník, hořčík, pH a hygienické
            limity). Archiv čtvrtletí tvoří i historii měření.
          </li>
          <li>
            <strong>Tvrdost vody po obcích</strong> – přehled tvrdosti pitné vody
            v obcích na Zlínsku.
          </li>
          <li>
            <strong>Zásobované obce</strong> – výčet obcí a částí Zlína, které
            zásobuje jednotlivá úpravna.
          </li>
          <li>
            <strong>Cena vodného a stočného</strong> – ceník platný pro daný rok.
          </li>
          <li>
            <strong>Průměrná spotřeba vody</strong> – údaj ČSÚ za Zlínský kraj
            (aktualizujeme ručně jednou ročně).
          </li>
        </ul>
        <p>
          Hodnoty pod mezí stanovitelnosti laboratoře zobrazujeme tak, jak je
          uvádí rozbor (například „&lt;0,02“). Přiřazení částí Zlína k úpravnám je
          hrubé: Vodárna Zlín uvádí jen východní a západní část města.
        </p>
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
          Web jednou týdně kontroluje, zda Vodárna Zlín nezveřejnila nové
          dokumenty. Nový rozbor se na webu objeví jen tehdy, když projde
          kontrolou (správné sloupce, limity a rozsahy hodnot). Data se naposledy
          změnila {formatDate(meta.updatedAt)}; nejnovější rozbor je za{" "}
          {meta.latestPeriodLabel}.
        </p>

        <h2>Jak vzniká orientační index</h2>
        <p>
          Hodnoty{" "}
          {sources.map((source) => `${source.name} ${source.quality}/100`).join(", ")}{" "}
          jsou vlastní orientační index VodaZlín.cz počítaný z posledního rozboru.
          Začíná na 96 bodech a klesá podle vzdálenosti vybraných parametrů od
          hygienických limitů a běžně příznivých rozsahů.
        </p>
        <p>
          Do indexu vstupuje tvrdost, pH, dusičnany, železo, mangan a
          mikrobiologické ukazatele. Tvrdost sama o sobě neznamená, že voda je
          zdravotně nevyhovující, ale ovlivňuje komfort v domácnosti, tvorbu
          vodního kamene a nastavení spotřebičů.
        </p>
        <p>
          Index záměrně nezačíná na 100 bodech a nemá vytvářet dojem úředního
          razítka. Je to zkratka pro rychlé porovnání vybraných parametrů. Pokud
          některý parametr leží blíže limitu nebo mimo obvyklý komfortní rozsah,
          index klesá. Pro detailní pochopení je ale vždy důležitější číst
          jednotlivé hodnoty než samotné skóre.
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
