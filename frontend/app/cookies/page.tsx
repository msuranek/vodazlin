import type { Metadata } from "next";
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
        <h2>Technické cookies</h2>
        <p>
          Některé údaje mohou být potřeba pro správné načtení stránky, bezpečnost
          a základní fungování webu. Tyto údaje nejsou určené k vytváření účtu na
          VodaZlín.cz, protože web žádné uživatelské účty neprovozuje.
        </p>

        <h2>Analytické cookies</h2>
        <p>
          Analytika pomáhá zjistit, kolik lidí stránky navštěvuje a které části
          webu jsou užitečné. Díky tomu lze lépe rozhodovat, jaké vysvětlující
          články nebo datové přehledy doplnit.
        </p>

        <h2>Reklamní cookies</h2>
        <p>
          Pokud jsou na webu aktivní reklamy Google AdSense, mohou reklamní
          systémy používat cookies nebo podobné identifikátory pro zobrazování a
          měření reklam podle pravidel poskytovatele.
        </p>

        <h2>Správa cookies</h2>
        <p>
          Cookies můžete omezit nebo smazat v nastavení svého prohlížeče. Některé
          volby pro reklamní personalizaci se spravují také v nastavení služeb
          Google.
        </p>
      </ArticleLayout>
      <Footer />
    </div>
  );
}
