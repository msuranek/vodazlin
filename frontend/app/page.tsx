import HomeClient from "./HomeClient";
import { getWaterQuality, getWaterPricing } from "@/lib/server-data";

export default async function Home() {
  const quality = getWaterQuality();
  const pricing = getWaterPricing();
  return <HomeClient quality={quality} pricing={pricing} />;
}
