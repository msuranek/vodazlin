"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const publisherId = "ca-pub-4993584404817759";

const adAllowedPaths = new Set([
  "/",
  "/kvalita/",
  "/ceny/",
  "/mapa/",
  "/o-projektu/",
]);

export default function AdSenseScript() {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  if (!adAllowedPaths.has(normalizedPath)) {
    return null;
  }

  return (
    <Script
      async
      id="adsense-auto-ads"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
