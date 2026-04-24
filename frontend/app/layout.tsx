import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VodaZlín.cz - Kvalita pitné vody ve Zlíně",
  description: "Aktuální informace o kvalitě pitné vody ve Zlíně. Rozbory vody, tvrdost, ceny, interaktivní mapa a kalkulačka spotřeby.",
  keywords: "voda Zlín, kvalita vody, tvrdost vody, pitná voda, rozbory vody, cena vody",
  authors: [{ name: "VodaZlín.cz" }],
  openGraph: {
    title: "VodaZlín.cz - Kvalita pitné vody ve Zlíně",
    description: "Aktuální data o kvalitě pitné vody ve Zlíně",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
