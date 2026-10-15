import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Cookies | VodaZlín.cz",
  description: "Informace o používání cookies na webu VodaZlín.cz pro analytiku, reklamy a technické fungování webu.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <ArticleLayout
        title="Cookies"
        description="Cookies a podobné technologie mohou pomáhat s měřením návštěvnosti, reklamami a bezpečným fungováním webu."
      >
        <h2>Souhlas s cookies</h2>
        <p>
          VodaZlín.cz používá pro správu souhlasu návštěvníků Google consent
          dialog z nástroje Privacy & messaging ve službě Google AdSense. Tento
          dialog je spravovaný Googlem a podporuje Transparency and Consent
          Framework organizace IAB pro zobrazování reklam v Evropském
          hospodářském prostoru, ve Spojeném království a ve Švýcarsku.
        </p>
        <p>
          Při první návštěvě se může zobrazit okno se souhlasem. V něm lze
          souhlas udělit, odmítnout nebo upravit podrobné možnosti. Souhlas lze
          později změnit přes odkaz „Nastavení ochrany soukromí a souborů
          cookie“, který se zobrazuje u Google consent lišty.
        </p>

        <h2>Technické cookies</h2>
        <p>
          Některé údaje mohou být potřeba pro správné načtení stránky, bezpečnost
          a základní fungování webu. Tyto údaje nejsou určené k vytváření účtu na
          VodaZlín.cz, protože web žádné uživatelské účty neprovozuje.
        </p>

        <h2>Analytické cookies</h2>
        <p>
          Web používá analytiku návštěvnosti provozovanou na doméně
          analytics.aidevelopers.cz. Analytika pomáhá zjistit, kolik lidí stránky
          navštěvuje a které části webu jsou užitečné. Díky tomu lze lépe
          rozhodovat, jaké vysvětlující články nebo datové přehledy doplnit.
        </p>
        <p>
          Analytické měření může pracovat s technickými údaji o návštěvě, jako je
          navštívená stránka, čas návštěvy, přibližné technické informace o
          zařízení nebo prohlížeči a referrer. Cílem není vytvářet uživatelské
          účty ani identifikovat konkrétní osobu na webu VodaZlín.cz.
        </p>

        <h2>Reklamní cookies</h2>
        <p>
          Web používá Google AdSense. Reklamní systémy Google a zapojení reklamní
          partneři mohou používat cookies, webové signály nebo podobné
          identifikátory pro zobrazování reklam, měření reklam, omezení počtu
          zobrazení, prevenci zneužití a případně personalizaci reklam podle
          uděleného souhlasu.
        </p>
        <p>
          Pokud návštěvník personalizaci odmítne, Google může i nadále zobrazovat
          nepersonalizované reklamy, pokud to odpovídá nastavení služby a
          udělenému souhlasu. Podrobnosti popisují dokumenty Google o používání
          cookies v AdSense a o reklamních technologiích Google.
        </p>

        <h2>Správa cookies</h2>
        <p>
          Cookies můžete omezit nebo smazat v nastavení svého prohlížeče.
          Souhlas s reklamními a analytickými účely lze spravovat také v Google
          consent dialogu na tomto webu. Některé volby pro reklamní
          personalizaci se spravují také v nastavení služeb Google.
        </p>
        <p>
          Další informace najdete v{" "}
          <Link href="/zasady-ochrany-soukromi/">zásadách ochrany soukromí</Link>,
          v dokumentu{" "}
          <a href="https://support.google.com/adsense/answer/7549925" target="_blank" rel="noopener noreferrer">
            Jak AdSense používá cookies
          </a>{" "}
          a v přehledu Google{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Reklama - ochrana soukromí a smluvní podmínky
          </a>.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
