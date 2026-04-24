import CenyClient from "./CenyClient";
import { getWaterPricing, dataMetadata } from "@/lib/server-data";

export default async function CenyPage() {
  const pricing = getWaterPricing();
  return <CenyClient pricing={pricing} meta={dataMetadata} />;
}
