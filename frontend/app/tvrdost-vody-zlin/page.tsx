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
        <p>
          Pro domácnost je důležité hlavně to, že tato hodnota není varováním
          před pitím vody. Tvrdost popisuje množství rozpuštěných minerálů,
          především vápníku a hořčíku. V běžném životě se projeví spíš na
          rychlovarné konvici, myčce, pračce, sprchové hlavici a dávkování
          čisticích prostředků než na okamžité zdravotní bezpečnosti vody.
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
        <p>
          Rozdíl několika stupňů německé tvrdosti už může být doma poznat.
          V části napojené na měkčí vodu se vodní kámen obvykle tvoří pomaleji,
          zatímco u tvrdší vody je vhodnější pečlivěji nastavit spotřebiče a
          počítat s pravidelným odvápněním. Proto na webu neuvádíme jen jednu
          hodnotu, ale propojujeme ji také s mapou a přehledem zdrojů.
        </p>

        <h2>Co tvrdost ovlivňuje</h2>
        <p>
          Tvrdší voda může rychleji vytvářet vodní kámen v rychlovarné konvici,
          bojleru, pračce nebo myčce. U myčky je proto dobré nastavit změkčovač
          podle místní tvrdosti a pravidelně doplňovat sůl.
        </p>
        <p>
          Prakticky se vyplatí sledovat tři místa. První je kuchyň: pokud se v
          konvici rychle tvoří bílý povlak, jde typicky o srážení minerálů při
          ohřevu. Druhé jsou spotřebiče s topným tělesem, kde usazeniny mohou
          zhoršovat účinnost ohřevu. Třetí je koupelna, kde se tvrdost projeví na
          bateriích, skle sprchového koutu a perlátorech.
        </p>

        <h2>Jak hodnotu použít v praxi</h2>
        <p>
          Pokud nastavujete myčku, hledejte v návodu tabulku tvrdosti vody.
          Výrobci často používají stupně °dH, mmol/l nebo rozsahy jako měkká,
          středně tvrdá a tvrdá voda. Pro Zlín dává smysl začít orientační
          hodnotou z této stránky a u konkrétní lokality ji porovnat s mapou.
        </p>
        <p>
          Jestli se po několika cyklech objevují bílé mapy na skle, může být
          změkčovač nastavený nízko. Pokud je nádobí naopak kluzké nebo zůstává
          výrazná chemická stopa, problém nemusí být tvrdost, ale dávkování
          leštidla nebo mycího prostředku. Vždy je lepší měnit jednu věc po
          druhé a několik mycích cyklů výsledek pozorovat.
        </p>

        <h2>Kdy má smysl vlastní měření</h2>
        <p>
          Web pracuje s veřejnými a orientačními daty pro město a jeho části.
          Pokud řešíte drahý spotřebič, domácí úpravnu vody, akvárium nebo
          zdravotně citlivou situaci, je přesnější použít test přímo u vás doma
          nebo laboratorní rozbor. Hodnota z vodovodní sítě se může na konkrétním
          kohoutku lišit podle vnitřních rozvodů, stáří instalace a provozu v
          domě.
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
