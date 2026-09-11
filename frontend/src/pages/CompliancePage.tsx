import { Briefcase, Calculator, FileText, RefreshCw, Scale, Send, ShieldAlert, ShieldCheck } from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PillarHero } from "@/components/common/PillarHero";
import { PillarProcessSteps } from "@/components/common/PillarProcessSteps";
import { RelatedTopicLink } from "@/components/common/RelatedTopicLink";
import { ServicesShowcase } from "@/components/common/ServicesShowcase";
import { WhyStrip } from "@/components/common/WhyStrip";
import placeholderPhoto from "@/assets/images/placeholders/placeholder-photo.svg";
import { curatedComplianceAreas, useComplianceAreasQuery } from "@/lib/api/compliance";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SHOWCASE_ICONS = [ShieldCheck, Calculator, FileText, ShieldAlert, Scale, RefreshCw];

// Same static-curated-meta pattern as IncorporationPage.tsx/ServicesPage.tsx, except
// the showcase's descriptions come from the real ComplianceArea.summary (fetched, not
// hardcoded) since curatedComplianceAreas only carries slug+label. The mandatory
// "general guidance, not legal advice" disclaimer (architecture.md's Invariants) is
// kept even though the reference design doesn't show one — a hard project rule
// outranks matching the reference pixel-for-pixel.
export function CompliancePage() {
  useDocumentTitle("Compliance");
  const { data: complianceAreas } = useComplianceAreasQuery();

  const showcaseItems = curatedComplianceAreas.map((area, index) => ({
    icon: SHOWCASE_ICONS[index % SHOWCASE_ICONS.length],
    title: area.label,
    description: complianceAreas?.find((a) => a.slug === area.slug)?.summary ?? "",
    to: `/compliance/${area.slug}`,
  }));

  return (
    <>
      <PillarHero
        image={placeholderPhoto}
        eyebrow="Compliance Services"
        title="Stay Compliant."
        highlight="Grow with Confidence."
        description="We provide reliable and proactive compliance solutions to help your business meet regulatory requirements and minimize risk in the UAE."
        quickLinks={curatedComplianceAreas.slice(0, 4).map((area) => ({
          icon: ShieldCheck,
          label: area.label,
          to: `/compliance/${area.slug}`,
        }))}
        primaryCta={{ label: "Get Started", to: "#lead-form" }}
        secondaryCta={{ label: "Speak to Our Experts", to: "/contact" }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
        <p className="rounded-lg bg-info-light px-4 py-3 text-center text-sm text-info">
          General guidance, not legal or tax advice — always confirm your specific obligations with a qualified
          professional.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-6">
        <RelatedTopicLink
          icon={Briefcase}
          title="Also Need Labour Law Guidance?"
          description="MOHRE work permits, the Wage Protection System, and Emiratisation quotas for UAE employers."
          to="/mohre"
          ctaLabel="Explore MOHRE Compliance"
        />
      </div>

      <WhyStrip
        title="Why Compliance Matters?"
        description="Stay ahead of regulations and build a stronger, more secure business."
        items={[
          { icon: ShieldAlert, title: "Risk Mitigation", description: "Avoid penalties from missed deadlines and filings." },
          { icon: Scale, title: "Regulatory Alignment", description: "Stay aligned with UAE tax and corporate law." },
          { icon: RefreshCw, title: "Business Continuity", description: "Keep your licence and approvals in good standing." },
          { icon: ShieldCheck, title: "Enhanced Credibility", description: "Build trust with banks, partners, and regulators." },
        ]}
      />

      <ServicesShowcase
        title="Our Compliance Services"
        description="Comprehensive support for your corporate and regulatory needs."
        items={showcaseItems}
        photoCard={{
          image: placeholderPhoto,
          title: "Compliant Today. Stronger Tomorrow.",
          description: "Let us handle the complexities so you can focus on growth.",
          ctaLabel: "Learn More",
          ctaTo: "/compliance",
        }}
      />

      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 md:px-6">
        <LeadForm
          defaultMainService="compliance"
          title="Request Compliance Support"
          description="Get professional assistance with your compliance requirements. Our team will review your needs and provide the right solution."
        />
      </section>

      <PillarProcessSteps
        description="A structured approach to keep your business compliant and risk-free."
        steps={[
          { icon: ShieldCheck, title: "Consultation", description: "Understand your requirements." },
          { icon: FileText, title: "Assessment", description: "Review your current gaps." },
          { icon: Send, title: "Implementation", description: "Apply required updates." },
          { icon: Calculator, title: "Monitoring", description: "Track ongoing compliance." },
          { icon: Scale, title: "Reporting", description: "Prepare and submit reports." },
          { icon: RefreshCw, title: "Ongoing Support", description: "Continuous compliance and updates." },
        ]}
      />

      <section className="relative bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: `url(${placeholderPhoto})` }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Need Compliance Support?</h2>
          <p className="max-w-xl text-white/80">
            Protect your business and stay ahead of regulatory requirements. Get in touch with our experts today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#lead-form" className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark">
              Get Started
            </a>
            <a
              href="https://wa.me/971585889033"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:border-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
