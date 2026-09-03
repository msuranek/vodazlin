import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Jak nastavit myčku podle tvrdosti vody | VodaZlín.cz",
  description: "Praktický návod, jak použít tvrdost vody ve Zlíně při nastavení změkčovače v myčce.",
};

export default function NastaveniMyckyPage() {
  const quality = getWaterQuality();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Jak nastavit myčku podle tvrdosti vody"
        description="Správné nastavení myčky pomáhá omezit bílé mapy na nádobí, chrání spotřebič a zlepšuje výsledek mytí."
      >
        <h2>Jakou hodnotu použít</h2>
        <p>
          Pro orientační nastavení můžete vyjít z hodnoty {formatNumber(quality.parameters.hardness)} °dH.
          Pokud znáte přesnou lokalitu a zdroj vody, porovnejte ji také s mapou
          a přehledem zdrojů.
        </p>

        <h2>Postup nastavení</h2>
        <ul>
          <li>v návodu k myčce najděte tabulku pro tvrdost vody,</li>
          <li>převeďte hodnotu °dH do rozsahu uvedeného výrobcem,</li>
          <li>nastavte úroveň změkčovače v menu nebo mechanickým voličem,</li>
          <li>doplňte regenerační sůl, pokud ji vaše myčka používá.</li>
        </ul>

        <h2>Když zůstávají bílé stopy</h2>
        <p>
          Bílé mapy mohou znamenat příliš tvrdou vodu pro aktuální nastavení,
          ale také nevhodné dávkování leštidla nebo mycího prostředku. Proto je
          lepší měnit jednu věc po druhé a výsledek porovnat po několika cyklech.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
