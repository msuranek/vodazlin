import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Jak se kontroluje kvalita pitné vody | VodaZlín.cz",
  description: "Přehled, jak se sleduje pitná voda, jaké parametry se hodnotí a proč se výsledky vztahují ke konkrétním místům a datům odběru.",
};

export default function KontrolaVodyPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Jak se kontroluje kvalita pitné vody"
        description="Kvalita pitné vody se neposuzuje jedním číslem. Sleduje se soubor chemických, fyzikálních a mikrobiologických ukazatelů."
      >
        <h2>Co se u pitné vody sleduje</h2>
        <p>
          Mezi často sledované hodnoty patří pH, dusičnany, železo, mangan,
          tvrdost, obsah minerálů a mikrobiologické ukazatele. Každý parametr má
          jiný význam: některé vypovídají o hygienické bezpečnosti, jiné spíš o
          chuti, barvě nebo provozu domácích spotřebičů.
        </p>
        <p>
          Proto je zavádějící chtít po vodě jedno jediné číslo. Voda může mít
          výborné mikrobiologické výsledky a zároveň být tvrdší, takže bude
          tvořit vodní kámen. Nebo může být chuťově v pořádku, ale u některých
          parametrů je stejně potřeba laboratorní měření, protože je člověk
          smysly spolehlivě nepozná.
        </p>

        <h2>Proč záleží na místě a datu</h2>
        <p>
          Výsledek rozboru patří ke konkrétnímu odběru. Hodnoty se mohou lišit
          podle zdroje vody, části sítě, směšování zdrojů nebo aktuálního provozu.
          Proto je dobré sledovat datum aktualizace a zdroj dat.
        </p>
        <p>
          U městského vodovodu se voda může v síti pohybovat z různých směrů a
          část města může být napojená na jiný zdroj než jiná lokalita. To je
          důvod, proč VodaZlín.cz kombinuje souhrnný přehled s mapou a proč u
          tvrdosti vody uvádí také souvislost se zdroji.
        </p>

        <h2>Chemické a mikrobiologické ukazatele</h2>
        <p>
          Chemické ukazatele, jako jsou dusičnany, železo, mangan, vápník nebo
          hořčík, popisují složení vody. Některé mají hygienický limit, jiné jsou
          důležité hlavně pro chuť, barvu, usazeniny nebo technické vlastnosti.
          Mikrobiologické ukazatele, například E. coli a enterokoky, se čtou
          jinak: u pitné vody se očekává nulový nález.
        </p>
        <p>
          Tvrdost vody je dobrý příklad parametru, který lidé často vnímají jako
          “kvalitu”, ale sám o sobě neříká, zda je voda pitná. Spíš pomáhá
          odpovědět na otázky kolem vodního kamene, myčky, pračky a údržby
          spotřebičů.
        </p>

        <h2>Jak s daty pracuje tento web</h2>
        <p>
          VodaZlín.cz bere veřejně dostupná data a převádí je do přehlednější
          podoby. Metodiku webu popisuje stránka{" "}
          <Link href="/o-projektu/">O projektu</Link>.
        </p>
        <p>
          Web se snaží oddělit tři vrstvy informací. První jsou automaticky
          aktualizovaná data, například ceník a dostupné hodnoty tvrdosti. Druhá
          je orientační datový základ pro vysvětlení parametrů. Třetí je
          redakční interpretace, která říká, jak s čísly prakticky pracovat doma.
        </p>
        <p>
          Pokud potřebujete závaznou odpověď pro konkrétní adresu, odběrné místo
          nebo zdravotní situaci, je nutné použít oficiální zdroje nebo vlastní
          laboratorní rozbor. Hodnota webu je v tom, že pomáhá číslům rozumět a
          najít souvislosti.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
