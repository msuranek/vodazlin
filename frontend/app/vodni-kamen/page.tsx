import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vodní kámen ve Zlíně | VodaZlín.cz",
  description: "Proč se tvoří vodní kámen, jak souvisí s tvrdostí vody ve Zlíně a jak ho v domácnosti omezit.",
};

export default function VodniKamenPage() {
  const quality = getWaterQuality();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Vodní kámen ve Zlíně a jak ho omezit"
        description="Vodní kámen je běžný důsledek tvrdší vody. Neznamená automaticky zdravotní problém, ale zvyšuje nároky na údržbu spotřebičů."
      >
        <h2>Proč vzniká</h2>
        <p>
          Vodní kámen vzniká hlavně vysrážením minerálů při ohřevu vody.
          Čím vyšší je tvrdost vody, tím rychleji se může usazovat na topných
          tělesech, bateriích a v konvicích.
        </p>
        <p>
          Orientační tvrdost v centrálním přehledu je {formatNumber(quality.parameters.hardness)} °dH.
          To odpovídá vodě, u které má smysl počítat s běžnou údržbou spotřebičů.
        </p>
        <p>
          Typickým místem, kde si vodního kamene všimnete nejdřív, je rychlovarná
          konvice. Bílý povlak na dně není nečistota z potrubí, ale minerální
          usazenina. Stejný princip probíhá v myčce, pračce, bojleru nebo na
          sprchové hlavici, jen ho tam není vždy vidět hned.
        </p>

        <h2>Co pomáhá v domácnosti</h2>
        <ul>
          <li>nastavit myčku podle tvrdosti vody,</li>
          <li>pravidelně doplňovat regenerační sůl,</li>
          <li>odstraňovat usazeniny z konvice a sprchové hlavice,</li>
          <li>u bojleru sledovat doporučený servisní interval.</li>
        </ul>
        <p>
          U vody s hodnotou kolem zlínského orientačního průměru obvykle není
          nutné dělat radikální opatření pro celou domácnost. Většině lidí
          pomůže správné nastavení myčky, pravidelné čištění perlátorů a rozumné
          odvápnění spotřebičů podle toho, jak často se používají. Důležité je
          neplést si vodní kámen se zdravotní závadností vody.
        </p>

        <h2>Jak často čistit spotřebiče</h2>
        <p>
          Univerzální interval neexistuje, protože záleží na spotřebě vody a
          teplotě ohřevu. Konvici má smysl vyčistit ve chvíli, kdy je usazenina
          zřetelná na dně nebo se odlupuje. U myčky je lepší vycházet z návodu
          výrobce, nastavení tvrdosti a signálu pro doplnění soli. U bojleru je
          rozumné držet se servisního intervalu, protože usazeniny nejsou vidět
          a mohou ovlivnit účinnost ohřevu.
        </p>

        <h2>Co nedělat zbytečně</h2>
        <p>
          Není nutné automaticky kupovat domácí změkčovač jen proto, že se v
          konvici tvoří povlak. Centrální změkčování vody mění minerální složení
          vody v celé domácnosti, vyžaduje údržbu a nemusí být přiměřené běžnému
          problému. Dává větší smysl tam, kde tvrdost dlouhodobě zkracuje
          životnost zařízení nebo komplikuje provoz celé instalace.
        </p>

        <h2>Kdy řešit změkčovač</h2>
        <p>
          Domácí změkčovač dává smysl hlavně tam, kde tvrdost dlouhodobě působí
          potíže spotřebičům nebo rozvodům. Pro pití není samotná střední tvrdost
          obvykle důvodem vodu odmítat.
        </p>
        <p>
          Před pořízením změkčovače je dobré znát tvrdost přímo v místě odběru,
          odhad spotřeby vody a náklady na provoz zařízení. U bytů často stačí
          řešit jen konkrétní spotřebiče. U rodinných domů s bojlerem, delšími
          rozvody a vyšší spotřebou už může dávat ekonomické srovnání větší
          smysl.
        </p>
        <p>
          Pro konkrétní nastavení spotřebičů pokračujte na{" "}
          <Link href="/nastaveni-mycky/">návod k nastavení myčky</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
