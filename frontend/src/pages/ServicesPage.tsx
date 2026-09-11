import { Award, Calculator, FileText, HeartPulse, IdCard, MessageCircle, Plane, Send, ShieldCheck, TrendingUp, Users } from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PillarHero } from "@/components/common/PillarHero";
import { PillarProcessSteps } from "@/components/common/PillarProcessSteps";
import { RelatedTopicLink } from "@/components/common/RelatedTopicLink";
import { ServicesShowcase } from "@/components/common/ServicesShowcase";
import { WhyStrip } from "@/components/common/WhyStrip";
import placeholderPhoto from "@/assets/images/hero/residency.png";
import { servicePillarMeta } from "@/lib/api/services";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SHOWCASE_ICONS = [IdCard, TrendingUp, Users, Award, FileText];

// Same static-pillar-meta pattern as IncorporationPage.tsx — see that file's comment.
export function ServicesPage() {
  useDocumentTitle("Residency");

  const showcaseItems = servicePillarMeta.map((pillar, index) => ({
    icon: SHOWCASE_ICONS[index % SHOWCASE_ICONS.length],
    title: pillar.label,
    description: pillar.description,
    to: `/residency/${pillar.pillar}`,
  }));

  return (
    <>
      <PillarHero
        image={placeholderPhoto}
        eyebrow="Residency Services"
        title="Your Future"
        highlight="in the UAE."
        description="We provide expert support for UAE residency, investor visas, family sponsorship and Golden Visa solutions — making your move to the UAE simple and stress-free."
        quickLinks={servicePillarMeta.map((pillar) => ({
          icon: IdCard,
          label: pillar.label,
          to: `/residency/${pillar.pillar}`,
        }))}
        primaryCta={{ label: "Get Started", to: "#lead-form" }}
        secondaryCta={{ label: "Speak to Our Experts", to: "/contact" }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
        <RelatedTopicLink
          icon={Plane}
          title="Need Visa or Immigration Support?"
          description="Employment, investor, and family visas, entry permits, and Establishment Card services."
          to="/immigration"
          ctaLabel="Explore Immigration Services"
        />
      </div>

      <WhyStrip
        title="Why Choose UAE Residency?"
        description="Live, work, and invest in one of the world's most dynamic and welcoming countries."
        items={[
          { icon: Calculator, title: "Tax Benefits", description: "No personal income tax on your UAE residency status." },
          { icon: Users, title: "Family Sponsorship", description: "Bring your spouse, children, or parents with you." },
          { icon: HeartPulse, title: "World-Class Healthcare", description: "Access to leading private and public healthcare." },
          { icon: ShieldCheck, title: "Safe & Secure Environment", description: "One of the world's safest countries to live and raise a family." },
        ]}
      />

      <ServicesShowcase
        title="Our Residency Services"
        description="Tailored solutions for individuals, families, and investors."
        items={showcaseItems}
        photoCard={{
          image: placeholderPhoto,
          title: "Your Family's Future in the UAE",
          description: "Expert support for a smooth and hassle-free process.",
          ctaLabel: "Learn More",
          ctaTo: "/residency",
        }}
      />

      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 md:px-6">
        <LeadForm
          defaultMainService="residency"
          title="Apply for UAE Residency"
          description="Get expert assistance for your UAE residency application. Fill in your details and our team will guide you through the process."
        />
      </section>

      <PillarProcessSteps
        description="A simple, clear, and efficient process to get your residency in the UAE."
        steps={[
          { icon: MessageCircle, title: "Initial Consultation", description: "Discuss your needs." },
          { icon: FileText, title: "Document Review", description: "Check your documents and requirements." },
          { icon: Send, title: "Application", description: "Submit to relevant authorities." },
          { icon: HeartPulse, title: "Medical & Emirates ID", description: "Complete medical and ID process." },
          { icon: Award, title: "Visa Issuance", description: "Receive your residency visa." },
          { icon: ShieldCheck, title: "Ongoing Support", description: "We're here for your journey." },
        ]}
      />

      <section className="relative bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: `url(${placeholderPhoto})` }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Ready to Apply for Residency?</h2>
          <p className="max-w-xl text-white/80">
            Take the first step towards your new life in the UAE. Our team is ready to guide you.
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
