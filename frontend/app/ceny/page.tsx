import type { Metadata } from "next";
import CenyClient from "./CenyClient";
import { getDataMetadata, getWaterPricing } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Cena vody ve Zlíně | VodaZlín.cz",
  description: "Aktuální cena vodného a stočného ve Zlíně, vysvětlení ceníku a orientační kalkulačka nákladů domácnosti.",
};

export default async function CenyPage() {
  const pricing = getWaterPricing();
  const meta = getDataMetadata();
  return <CenyClient pricing={pricing} meta={meta} />;
}
