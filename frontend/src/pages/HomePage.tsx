import { Marquee } from "@/components/common/Marquee";
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
      <Marquee
        phrases={[
          "Strategic Advisory, Straightforward Execution",
          "UAE Residency • Incorporation • Compliance • Licensing",
          "One Senior Advisor From Start To Finish",
          "Transparent, Practical Guidance",
          "Plan With A Clear Strategy",
        ]}
        ctaLabel="Book a Consultation"
        ctaTo="/contact"
      />
      <ServicesOverview />
      <StatsStrip />
      <AboutTeaser />
      <PhilosophyStrip />
      <ClosingCta />
    </>
  );
}
