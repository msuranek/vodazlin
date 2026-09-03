import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getDataMetadata, getWaterQuality, getWaterPricing } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "VodaZlín.cz - kvalita pitné vody ve Zlíně",
  description: "Přehled kvality pitné vody ve Zlíně, tvrdosti vody, cen vodného a stočného a praktických vysvětlení pro domácnosti.",
};

export default async function Home() {
  const quality = getWaterQuality();
  const pricing = getWaterPricing();
  const meta = getDataMetadata();
  return <HomeClient quality={quality} pricing={pricing} meta={meta} />;
}
