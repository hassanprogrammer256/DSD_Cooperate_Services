import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Hero } from "@/components/sections/Hero";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle("");

  return (
    <>
      <Hero />
      <ServicesOverview />
      <StatsStrip />
      <AboutTeaser />
      <PhilosophyStrip />
      <ClosingCta />
    </>
  );
}
