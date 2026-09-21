import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality, healthLimits } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dusičnany v pitné vodě | VodaZlín.cz",
  description: "Co znamenají dusičnany v pitné vodě, jaký je limit a jak číst aktuální hodnoty ve Zlíně.",
};

export default function DusicnanyPage() {
  const quality = getWaterQuality();
  const value = quality.parameters.nitrates;
  const limit = healthLimits.nitrates.max;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Dusičnany v pitné vodě"
        description="Dusičnany patří mezi důležité chemické ukazatele pitné vody. Sledují se hlavně kvůli hygienickému limitu a citlivějším skupinám obyvatel."
      >
        <h2>Aktuální hodnota ve Zlíně</h2>
        <p>
          V přehledu VodaZlín.cz je uvedeno {formatNumber(value)} mg/l.
          Hygienický limit používaný v přehledu je {formatNumber(limit, 0)} mg/l,
          takže hodnota odpovídá zhruba {formatNumber((value / limit) * 100, 0)} %
          limitu.
        </p>
        <p>
          Tato rezerva je užitečná pro rychlou orientaci, ale sama o sobě
          nenahrazuje oficiální výsledek pro konkrétní odběrné místo. U
          dusičnanů je důležité sledovat nejen jedno číslo, ale také zdroj dat,
          datum měření a to, zda jde o veřejný vodovod, studnu nebo jiný zdroj.
        </p>

        <h2>Jak hodnotu číst</h2>
        <p>
          Nižší hodnota vůči limitu znamená větší rezervu. Samotné číslo ale
          vždy patří do kontextu konkrétního odběrného místa, data měření a
          metodiky zdroje.
        </p>
        <p>
          U veřejného vodovodu se kvalita posuzuje v rámci provozního a
          hygienického dohledu. U soukromých studní je situace jiná: vlastník si
          musí kvalitu hlídat sám a dusičnany patří mezi ukazatele, které má
          smysl sledovat pravidelně. Proto nelze hodnotu z veřejného vodovodu
          jednoduše převzít jako informaci o studni na zahradě.
        </p>

        <h2>Pro koho jsou dusičnany důležité</h2>
        <p>
          Dusičnany se řeší hlavně kvůli citlivějším skupinám obyvatel a kvůli
          tomu, že ve vyšších koncentracích mohou být zdravotně významné. Tento
          web proto u nich ukazuje poměr k limitu a nezachází s nimi jen jako s
          běžným estetickým parametrem, jako je třeba zákal nebo chuť.
        </p>
        <p>
          Pokud řešíte kojeneckou vodu, zdravotní doporučení nebo podezření na
          kontaminaci, je lepší vycházet z aktuálního laboratorního rozboru a z
          doporučení hygienické stanice. Orientační přehled na webu má pomoci s
          porozuměním číslům, ne rozhodovat za lékaře nebo úřad.
        </p>

        <h2>Rozdíl mezi vodovodem a studnou</h2>
        <p>
          Veřejný vodovod má jiný režim kontroly než individuální studna. U
          studní mohou dusičnany ovlivnit okolní pole, septiky, hnojení,
          povrchová voda nebo stav vrtu. Proto se u studní často doporučuje
          vlastní rozbor, zvlášť pokud vodu pijí děti nebo se studna delší dobu
          nekontrolovala.
        </p>

        <h2>Kde najít souvislosti</h2>
        <p>
          Přehled dalších parametrů najdete na stránce{" "}
          <Link href="/kvalita/">kvalita vody</Link>. Shrnutí pro běžného
          návštěvníka je na stránce{" "}
          <Link href="/je-voda-ve-zline-pitna/">je voda ve Zlíně pitná</Link>.
        </p>
        <p>
          Dobré je porovnat dusičnany také s pH, mikrobiologickými ukazateli a
          informací o zdroji vody. Teprve kombinace parametrů dává lepší obrázek
          než izolované číslo bez souvislostí.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
