import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getWaterQuality } from "@/lib/server-data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Je voda ve Zlíně pitná? | VodaZlín.cz",
  description: "Srozumitelné vysvětlení, jak číst dostupné údaje o pitné vodě ve Zlíně a co znamenají hlavní parametry.",
};

export default function JeVodaPitnaPage() {
  const quality = getWaterQuality();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Je voda ve Zlíně bezpečná k pití?"
        description="Dostupné hodnoty na tomto webu slouží jako orientační přehled. Pro závazné posouzení jsou rozhodující oficiální rozbory a sdělení provozovatele nebo hygienické stanice."
      >
        <h2>Co ukazují aktuální hodnoty</h2>
        <p>
          Orientační index webu je {quality.score}/100. pH je {formatNumber(quality.parameters.pH, 2)},
          dusičnany {formatNumber(quality.parameters.nitrates)} mg/l a E. coli
          je uvedena jako {quality.bacteriological.ecoli} KTJ/100 ml.
        </p>
        <p>
          V běžném čtení to znamená, že hlavní parametry v přehledu nepůsobí
          jako varování před pitím vody z veřejného vodovodu. pH je v neutrálním
          pásmu, dusičnany jsou v přehledu pod hygienickým limitem a
          mikrobiologické ukazatele jsou uváděné jako nulové. Takové shrnutí je
          ale pořád orientační, protože web neprovádí vlastní odběry.
        </p>

        <h2>Co z toho plyne pro domácnost</h2>
        <p>
          Uvedené hodnoty nevypadají jako signál k běžnému vyhýbání se vodě z
          kohoutku. Důležité je ale rozlišovat obecný přehled pro město a přesné
          údaje pro konkrétní odběrné místo.
        </p>
        <p>
          Nejčastější praktická otázka ve Zlíně proto není, jestli vodu vůbec
          pít, ale jak se chová v domácnosti. Tvrdost ovlivňuje vodní kámen,
          nastavení myčky a údržbu spotřebičů. Chemické a mikrobiologické
          ukazatele zase pomáhají pochopit, proč nestačí hodnotit vodu jen podle
          chuti nebo vzhledu.
        </p>

        <h2>Kdy voda může působit jinak</h2>
        <p>
          I vyhovující pitná voda může mít jinou chuť po odstávce, opravě sítě,
          delším stání v domovních rozvodech nebo po změně provozu vodovodu.
          Krátkodobý zákal po opravě nemusí automaticky znamenat dlouhodobý
          problém, ale je dobré sledovat oznámení provozovatele a nechat vodu
          odtéct podle jeho doporučení.
        </p>
        <p>
          Pokud se problém týká jen jednoho bytu nebo domu, příčina může být i ve
          vnitřních rozvodech, bojleru, filtru nebo perlátoru. Proto má smysl
          porovnat více kohoutků, studenou a teplou vodu a případně se zeptat
          sousedů, zda pozorují stejnou změnu.
        </p>

        <h2>Kdy hledat oficiální informaci</h2>
        <p>
          Pokud se objeví zákal, nezvyklý zápach, havárie, výluka nebo doporučení
          vodu nepít, je potřeba sledovat oficiální kanály provozovatele a hygieny.
          Tento web takové oznámení nenahrazuje.
        </p>
        <p>
          Oficiální informace hledejte také při přípravě vody pro kojence, při
          zdravotním omezení, po delší odstávce objektu nebo u soukromé studny.
          V těchto situacích je lepší pracovat s aktuálním rozborem nebo
          doporučením odborného místa než s obecným městským přehledem.
        </p>
        <p>
          Podrobná čísla jsou na stránce <Link href="/kvalita/">kvalita vody</Link>.
        </p>
        <p>
          Pro běžnou domácí interpretaci doporučujeme pokračovat také na stránky{" "}
          <Link href="/tvrdost-vody-zlin/">tvrdost vody ve Zlíně</Link>,{" "}
          <Link href="/dusicnany-v-pitne-vode/">dusičnany v pitné vodě</Link> a{" "}
          <Link href="/jak-se-kontroluje-pitna-voda/">jak se kontroluje pitná voda</Link>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
