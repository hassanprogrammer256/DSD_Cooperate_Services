import { Award, Building2, ClipboardCheck, FileBadge, FileText, Globe, Handshake, MessageCircle, Send, Settings } from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PillarHero } from "@/components/common/PillarHero";
import { PillarProcessSteps } from "@/components/common/PillarProcessSteps";
import { ServicesShowcase } from "@/components/common/ServicesShowcase";
import { WhyStrip } from "@/components/common/WhyStrip";
import placeholderPhoto from "@/assets/images/hero/incooperate.webp";
import { incorporationPillarMeta } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SHOWCASE_ICONS = [Building2, FileBadge, Globe, ClipboardCheck, FileText];

export function IncorporationPage() {
  useDocumentTitle("Incorporation");

  const showcaseItems = incorporationPillarMeta.map((pillar, index) => ({
    icon: SHOWCASE_ICONS[index % SHOWCASE_ICONS.length],
    title: pillar.label,
    description: pillar.description,
    to: `/incorporation/${pillar.pillar}`,
  }));

  return (
    <>
      <PillarHero
        image={placeholderPhoto}
        eyebrow="Incorporation Services"
        title="Your Business."
        highlight="Our Expertise."
        description="We help you establish and grow your business in the UAE with seamless company formation, licensing, and corporate structuring solutions."
        quickLinks={incorporationPillarMeta.map((pillar) => ({
          icon: Building2,
          label: pillar.label,
          to: `/incorporation/${pillar.pillar}`,
        }))}
        primaryCta={{ label: "Get Started", to: "#lead-form" }}
        secondaryCta={{ label: "Speak to Our Experts", to: "/contact" }}
      />

      <WhyStrip
        title="Why Incorporate in the UAE?"
        description="Access a strategic location, world-class infrastructure, and a business-friendly environment designed for growth."
        items={[
          { icon: Award, title: "100% Foreign Ownership", description: "Full ownership eligible on most mainland and free zone routes." },
          { icon: FileBadge, title: "Tax Benefits", description: "Competitive corporate tax treatment and free zone incentives." },
          { icon: Globe, title: "Strategic Location", description: "A global logistics and trade hub connecting East and West." },
          { icon: Handshake, title: "Access to Global Markets", description: "A base for trading across the GCC, Africa, and beyond." },
        ]}
      />

      <ServicesShowcase
        title="Our Incorporation Services"
        description="End-to-end support for your business setup and growth."
        items={showcaseItems}
        photoCard={{
          image: placeholderPhoto,
          title: "Build Your Business in the UAE",
          description: "From idea to incorporation, we're with you every step.",
          ctaLabel: "Learn More",
          ctaTo: "/incorporation",
        }}
      />

      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 md:px-6">
        <LeadForm
          defaultMainService="incorporation"
          title="Tell Us What You Need"
          description="Share your business requirements and our team will provide the right guidance and support."
        />
      </section>

      <PillarProcessSteps
        description="A simple, clear, and efficient process to get your business started."
        steps={[
          { icon: MessageCircle, title: "Initial Consultation", description: "Discuss your needs." },
          { icon: FileText, title: "Documentation", description: "Prepare required documents." },
          { icon: Send, title: "Submission", description: "Lodge with the relevant authorities." },
          { icon: Award, title: "Approvals", description: "Receive licences and approvals." },
          { icon: Settings, title: "Setup", description: "Complete business setup." },
          { icon: Handshake, title: "Ongoing Support", description: "We're here as you grow." },
        ]}
      />

      <section className="relative bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: `url(${placeholderPhoto})` }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Ready to Set Up Your Business?</h2>
          <p className="max-w-xl text-white/80">
            Let's turn your vision into reality. Get in touch with our team today for expert guidance.
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
