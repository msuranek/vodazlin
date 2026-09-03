import type { Metadata } from "next";
import KvalitaClient from "./KvalitaClient";
import { getDataMetadata, getWaterQuality, getWaterSources, historicalData, healthLimits } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Kvalita pitné vody ve Zlíně | VodaZlín.cz",
  description: "Parametry pitné vody ve Zlíně včetně tvrdosti, pH, dusičnanů, železa, manganu a vysvětlení hygienických limitů.",
};

export default async function KvalitaPage() {
  const quality = getWaterQuality();
  const sources = getWaterSources();
  const meta = getDataMetadata();
  return (
    <KvalitaClient
      quality={quality}
      historical={historicalData}
      sources={sources}
      limits={healthLimits}
      meta={meta}
    />
  );
}
