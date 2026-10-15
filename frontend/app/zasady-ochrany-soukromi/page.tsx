import type { Metadata } from "next";
import Link from "next/link";
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
        <p>
          Při návštěvě webu se zároveň mohou zpracovávat běžné technické údaje,
          které vznikají při načítání webové stránky, například IP adresa,
          informace o prohlížeči, zařízení, navštívené stránce, čase návštěvy a
          referreru. Část těchto údajů mohou zpracovávat také poskytovatelé
          analytiky a reklam popsaní níže.
        </p>

        <h2>Analytika návštěvnosti</h2>
        <p>
          Web používá analytický nástroj dostupný na doméně
          analytics.aidevelopers.cz pro základní měření návštěvnosti. Analytika
          pomáhá porozumět tomu, které stránky lidé používají a které části webu
          je vhodné zlepšit.
        </p>
        <p>
          Účelem analytiky je provoz a zlepšování informačního webu, ne vytváření
          uživatelských účtů. Analytické zpracování může být ovlivněno nastavením
          souhlasu v Google consent dialogu a nastavením prohlížeče.
        </p>

        <h2>Reklamy</h2>
        <p>
          Web používá Google AdSense pro zobrazování reklam. Reklamní služby
          Google a zapojení reklamní partneři mohou pracovat se soubory cookies,
          webovými signály nebo podobnými identifikátory podle nastavení
          prohlížeče, souhlasu návštěvníka a pravidel poskytovatele reklamy.
        </p>
        <p>
          Souhlas pro reklamní účely je na webu spravovaný pomocí Google consent
          dialogu z nástroje Privacy & messaging ve službě Google AdSense. Dialog
          umožňuje souhlas udělit, odmítnout nebo upravit a podporuje
          Transparency and Consent Framework organizace IAB.
        </p>

        <h2>Správa souhlasu a cookies</h2>
        <p>
          Návštěvník může svůj souhlas spravovat v Google consent dialogu, který
          se zobrazuje při návštěvě webu nebo přes odkaz „Nastavení ochrany
          soukromí a souborů cookie“. Cookies lze zároveň mazat nebo blokovat v
          nastavení prohlížeče.
        </p>
        <p>
          Podrobnější popis kategorií cookies je na stránce{" "}
          <Link href="/cookies/">Cookies</Link>. Další informace o reklamních
          technologiích Google najdete v dokumentu{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Reklama - ochrana soukromí a smluvní podmínky
          </a>{" "}
          a v nápovědě{" "}
          <a href="https://support.google.com/adsense/answer/7549925" target="_blank" rel="noopener noreferrer">
            Jak AdSense používá cookies
          </a>.
        </p>

        <h2>Doba uchování</h2>
        <p>
          Zprávy zaslané e-mailem uchováváme po dobu potřebnou k vyřízení dotazu
          a přiměřené navazující komunikace. Technické, analytické a reklamní
          údaje zpracovávané třetími stranami se řídí jejich pravidly,
          nastavením souhlasu a dobami uchování daných služeb.
        </p>

        <h2>Práva návštěvníků</h2>
        <p>
          Podle platných právních předpisů můžete mít právo požádat o informace
          ke zpracování osobních údajů, opravu, výmaz, omezení zpracování,
          námitku proti zpracování nebo přenositelnost údajů. Pokud se domníváte,
          že je s vašimi údaji nakládáno v rozporu s právními předpisy, můžete se
          obrátit také na Úřad pro ochranu osobních údajů.
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
