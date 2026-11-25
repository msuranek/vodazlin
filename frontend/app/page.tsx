import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getDataMetadata, getLatestReport, getLimitExceedances, getWaterPricing, getWaterSources } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "VodaZlín.cz - kvalita pitné vody ve Zlíně",
  description: "Přehled kvality pitné vody ve Zlíně, tvrdosti vody, cen vodného a stočného a praktických vysvětlení pro domácnosti.",
};

export default async function Home() {
  const report = getLatestReport();
  const sources = getWaterSources();
  const pricing = getWaterPricing();
  const meta = getDataMetadata();
  const allWithinLimits = getLimitExceedances(report).length === 0;
  return (
    <HomeClient
      report={report}
      sources={sources}
      allWithinLimits={allWithinLimits}
      pricing={pricing}
      meta={meta}
    />
  );
}
