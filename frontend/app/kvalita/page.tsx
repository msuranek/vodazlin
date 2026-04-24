import KvalitaClient from "./KvalitaClient";
import { getWaterQuality, getWaterSources, historicalData, healthLimits, dataMetadata } from "@/lib/server-data";

export default async function KvalitaPage() {
  const quality = getWaterQuality();
  const sources = getWaterSources();
  return (
    <KvalitaClient
      quality={quality}
      historical={historicalData}
      sources={sources}
      limits={healthLimits}
      meta={dataMetadata}
    />
  );
}
