import MapaClient from "./MapaClient";
import { getWaterSources, zlínDistricts } from "@/lib/server-data";

export default async function MapaPage() {
  const sources = getWaterSources();
  return <MapaClient sources={sources} districts={zlínDistricts} />;
}
