import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality, getWaterSources } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tvrdost vody ve Zlíně | VodaZlín.cz",
  description: "Co znamená tvrdost vody ve Zlíně, jak se liší podle zdroje a proč je důležitá pro spotřebiče i domácnost.",
};

export default function TvrdostVodyPage() {
  const quality = getWaterQuality();
  const sources = getWaterSources();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Tvrdost vody ve Zlíně"
        description="Tvrdost vody popisuje hlavně obsah vápníku a hořčíku. Pro zdraví obvykle nebývá problém, ale v domácnosti rozhoduje o vodním kameni, dávkování prostředků a nastavení spotřebičů."
      >
        <h2>Aktuální orientační hodnota</h2>
        <p>
          Souhrnná hodnota pro centrální přehled je {formatNumber(quality.parameters.hardness)} °dH.
          Podle běžné klasifikace jde o středně tvrdou vodu.
        </p>

        <h2>Rozdíly podle zdroje</h2>
        <p>
          Zlín nemusí mít ve všech částech města úplně stejnou tvrdost. Záleží na
          tom, ze kterého vodního zdroje nebo úpravny je konkrétní lokalita
          zásobovaná.
        </p>
        <ul>
          {sources.map((source) => (
            <li key={source.id}>
              {source.name}: {formatNumber(source.hardness)} °dH
              ({formatNumber(source.hardnessMmol, 2)} mmol/l), {source.waterType}
            </li>
          ))}
        </ul>

        <h2>Co tvrdost ovlivňuje</h2>
        <p>
          Tvrdší voda může rychleji vytvářet vodní kámen v rychlovarné konvici,
          bojleru, pračce nebo myčce. U myčky je proto dobré nastavit změkčovač
          podle místní tvrdosti a pravidelně doplňovat sůl.
        </p>
        <p>
          Další praktické návody najdete na stránkách{" "}
          <Link href="/vodni-kamen/">vodní kámen</Link> a{" "}
          <Link href="/nastaveni-mycky/">nastavení myčky podle tvrdosti vody</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
