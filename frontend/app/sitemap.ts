import type { MetadataRoute } from "next";

const routes = [
  "",
  "/kvalita",
  "/ceny",
  "/mapa",
  "/o-projektu",
  "/tvrdost-vody-zlin",
  "/vodni-kamen",
  "/nastaveni-mycky",
  "/dusicnany-v-pitne-vode",
  "/je-voda-ve-zline-pitna",
  "/jak-se-kontroluje-pitna-voda",
  "/zdroje-vody-zlin",
  "/klecuvka-vs-tlumacov",
  "/zasady-ochrany-soukromi",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://www.vodazlin.cz${route}/`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
