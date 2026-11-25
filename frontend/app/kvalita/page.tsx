import type { Metadata } from "next";
import KvalitaClient from "./KvalitaClient";
import {
  getDataMetadata,
  getLatestReport,
  getLimitExceedances,
  getPlantScore,
  getQualityDocuments,
  getQualityHistory,
  getWaterSources,
} from "@/lib/server-data";
import { plants } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kvalita pitné vody ve Zlíně | VodaZlín.cz",
  description: "Parametry pitné vody ve Zlíně včetně tvrdosti, pH, dusičnanů, železa, manganu a vysvětlení hygienických limitů.",
};

export default async function KvalitaPage() {
  const report = getLatestReport();
  const history = getQualityHistory()
    .slice()
    .reverse()
    .map((item) => ({
      period: item.period,
      title: item.title,
      sourceUrl: item.sourceUrl,
      plants: plants.map((plant) => ({
        id: plant.id,
        hardness: item.plants[plant.id].hardness.raw,
        pH: item.plants[plant.id].pH.raw,
        nitrates: item.plants[plant.id].nitrates.raw,
        iron: item.plants[plant.id].iron.raw,
        score: getPlantScore(item, plant.id),
      })),
    }));
  return (
    <KvalitaClient
      report={report}
      history={history}
      sources={getWaterSources()}
      documents={getQualityDocuments()}
      allWithinLimits={getLimitExceedances(report).length === 0}
      meta={getDataMetadata()}
    />
  );
}
