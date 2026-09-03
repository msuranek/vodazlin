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

        <h2>Proč záleží na místě a datu</h2>
        <p>
          Výsledek rozboru patří ke konkrétnímu odběru. Hodnoty se mohou lišit
          podle zdroje vody, části sítě, směšování zdrojů nebo aktuálního provozu.
          Proto je dobré sledovat datum aktualizace a zdroj dat.
        </p>

        <h2>Jak s daty pracuje tento web</h2>
        <p>
          VodaZlín.cz bere veřejně dostupná data a převádí je do přehlednější
          podoby. Metodiku webu popisuje stránka{" "}
          <Link href="/o-projektu/">O projektu</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
