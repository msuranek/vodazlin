import type { Metadata } from "next";
import Link from "next/link";
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
        <p>
          Myčky obvykle nechtějí přesné laboratorní číslo na desetiny. V návodu
          bývá tabulka, která hodnotu tvrdosti zařadí do několika stupňů. Proto
          je pro běžné nastavení důležitější zvolit správné pásmo než trefit
          dokonale přesnou hodnotu. Pokud bydlíte v části města s tvrdší vodou,
          začněte spíš vyšším stupněm změkčovače.
        </p>

        <h2>Postup nastavení</h2>
        <ul>
          <li>v návodu k myčce najděte tabulku pro tvrdost vody,</li>
          <li>převeďte hodnotu °dH do rozsahu uvedeného výrobcem,</li>
          <li>nastavte úroveň změkčovače v menu nebo mechanickým voličem,</li>
          <li>doplňte regenerační sůl, pokud ji vaše myčka používá.</li>
        </ul>
        <p>
          Po změně nastavení nehodnoťte výsledek po jediném mycím cyklu. Myčka
          může potřebovat několik cyklů, než se projeví nové dávkování soli a
          leštidla. Smysl dává sledovat hlavně čiré sklenice, nerezové příbory a
          vnitřek myčky, protože tam jsou zbytky minerálů vidět nejrychleji.
        </p>

        <h2>Tablety all-in-one a sůl</h2>
        <p>
          Kombinované tablety mohou u měkčí vody stačit, ale u středně tvrdé
          vody se často vyplatí používat sůl i leštidlo samostatně podle návodu
          myčky. Tableta sama o sobě nemusí správně nahradit změkčovač, pokud je
          zařízení nastavené na příliš nízkou tvrdost.
        </p>

        <h2>Když zůstávají bílé stopy</h2>
        <p>
          Bílé mapy mohou znamenat příliš tvrdou vodu pro aktuální nastavení,
          ale také nevhodné dávkování leštidla nebo mycího prostředku. Proto je
          lepší měnit jednu věc po druhé a výsledek porovnat po několika cyklech.
        </p>
        <p>
          Pokud jsou stopy drsné a jdou odstranit octem nebo kyselinou
          citronovou, často jde o minerální usazeniny. Pokud je povrch spíš
          duhový nebo mastný, může být problém v leštidle, programu nebo
          množství mycí chemie. Tvrdost vody je tedy důležitá, ale není jediná
          proměnná.
        </p>

        <h2>Jak nastavení souvisí se Zlínem</h2>
        <p>
          Ve Zlíně se tvrdost může lišit podle zdroje a části města. Proto má
          smysl spojit tento návod s <Link href="/mapa/">mapou lokalit</Link> a
          stránkou <Link href="/tvrdost-vody-zlin/">tvrdost vody ve Zlíně</Link>.
          Pokud se stěhujete v rámci města, nastavení myčky nemusí zůstat ideální
          navždy.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
