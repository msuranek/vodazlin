import type { Metadata } from "next";
import MapaClient from "./MapaClient";
import { getDataMetadata, getWaterSources, zlínDistricts } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Mapa tvrdosti vody ve Zlíně | VodaZlín.cz",
  description: "Mapa městských částí Zlína, zdrojů pitné vody a orientační tvrdosti vody podle dostupných veřejných podkladů.",
};

export default async function MapaPage() {
  const sources = getWaterSources();
  const meta = getDataMetadata();
  return <MapaClient sources={sources} districts={zlínDistricts} meta={meta} />;
}
