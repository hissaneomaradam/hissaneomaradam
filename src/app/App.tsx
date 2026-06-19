import { PortfolioOS } from "../components/PortfolioOS/PortfolioOS";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function App() {
  return (
    <>
      <PortfolioOS />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
