import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Zásady ochrany soukromí | VodaZlín.cz",
  description: "Informace o tom, jak VodaZlín.cz pracuje s návštěvnickými daty, analytikou, reklamami a kontaktem e-mailem.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Zásady ochrany soukromí"
        description="Tato stránka shrnuje, jak VodaZlín.cz přistupuje k soukromí návštěvníků, analytice a reklamním technologiím."
      >
        <h2>Jaká data web zpracovává</h2>
        <p>
          VodaZlín.cz je statický informační web. Pro běžné zobrazení obsahu
          nevyžaduje registraci, uživatelský účet ani zadávání osobních údajů.
        </p>
        <p>
          Pokud nás kontaktujete e-mailem, zpracováváme údaje uvedené ve zprávě
          pouze za účelem odpovědi na daný dotaz.
        </p>

        <h2>Analytika návštěvnosti</h2>
        <p>
          Web používá analytický nástroj pro základní měření návštěvnosti.
          Analytika pomáhá porozumět tomu, které stránky lidé používají a které
          části webu je vhodné zlepšit.
        </p>

        <h2>Reklamy</h2>
        <p>
          Web může používat reklamní technologie Google AdSense. Reklamní služby
          mohou pracovat se soubory cookies nebo podobnými identifikátory podle
          nastavení prohlížeče, souhlasu návštěvníka a pravidel poskytovatele
          reklamy.
        </p>

        <h2>Kontakt</h2>
        <p>
          Dotazy k soukromí můžete poslat na e-mail info@vodazlin.cz.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
