import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterSources } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Odkud bere Zlín pitnou vodu | VodaZlín.cz",
  description: "Přehled hlavních zdrojů pitné vody pro Zlín, rozdílů v tvrdosti a toho, proč se hodnoty mohou lišit podle lokality.",
};

export default function ZdrojeVodyPage() {
  const sources = getWaterSources();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Odkud bere Zlín pitnou vodu"
        description="Pitná voda ve Zlíně může pocházet z různých zdrojů a úpraven. Právě proto se tvrdost a některé provozní vlastnosti vody mohou mezi částmi města lišit."
      >
        <h2>Hlavní zdroje v přehledu</h2>
        <p>
          VodaZlín.cz pracuje se dvěma hlavními zdroji uvedenými v datovém
          přehledu. U každého uvádíme orientační tvrdost a oblasti, které jsou s
          daným zdrojem v mapě propojené.
        </p>
        <ul>
          {sources.map((source) => (
            <li key={source.id}>
              {source.name}: {formatNumber(source.hardness)} °dH,
              {formatNumber(source.hardnessMmol, 2)} mmol/l, {source.waterType}
            </li>
          ))}
        </ul>

        <h2>Proč záleží na lokalitě</h2>
        <p>
          Vodovodní síť není jen jedna trubka s jednou neměnnou hodnotou pro
          celé město. Voda se může lišit podle zdroje, směšování, provozu sítě i
          konkrétní části Zlína. Proto je mapa užitečná hlavně jako orientační
          pomůcka, ne jako laboratorní výsledek pro konkrétní kohoutek.
        </p>

        <h2>Co se může měnit</h2>
        <p>
          Nejčastěji si lidé všimnou rozdílu v tvrdosti vody. Ta se projeví na
          vodním kameni, nastavení myčky nebo pocitu při mytí. Zdravotní
          bezpečnost pitné vody se ale posuzuje podle širšího souboru ukazatelů,
          nejen podle tvrdosti.
        </p>
        <p>
          Srovnání dvou zdrojů najdete na stránce{" "}
          <Link href="/klecuvka-vs-tlumacov/">Klečůvka vs. Tlumačov</Link>.
          Místní přehled najdete v <Link href="/mapa/">mapě Zlína</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
