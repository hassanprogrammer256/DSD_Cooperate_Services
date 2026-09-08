import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { CtaStrip } from "@/components/sections/CtaStrip";
import { Hero } from "@/components/sections/Hero";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle("");

  return (
    <>
      <Hero />
      <CtaStrip />
      <ServicesOverview />
      <StatsStrip />
      <AboutTeaser />
      <PhilosophyStrip />
      <Testimonials />
      <ClosingCta />
    </>
  );
}
