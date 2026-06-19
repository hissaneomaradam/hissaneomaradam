import { PortfolioOS } from "../components/PortfolioOS/PortfolioOS";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
export default function App() {
  return (
    <>
      <PortfolioOS />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
