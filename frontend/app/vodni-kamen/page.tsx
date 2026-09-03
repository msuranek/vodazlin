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

        <h2>Co pomáhá v domácnosti</h2>
        <ul>
          <li>nastavit myčku podle tvrdosti vody,</li>
          <li>pravidelně doplňovat regenerační sůl,</li>
          <li>odstraňovat usazeniny z konvice a sprchové hlavice,</li>
          <li>u bojleru sledovat doporučený servisní interval.</li>
        </ul>

        <h2>Kdy řešit změkčovač</h2>
        <p>
          Domácí změkčovač dává smysl hlavně tam, kde tvrdost dlouhodobě působí
          potíže spotřebičům nebo rozvodům. Pro pití není samotná střední tvrdost
          obvykle důvodem vodu odmítat.
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
