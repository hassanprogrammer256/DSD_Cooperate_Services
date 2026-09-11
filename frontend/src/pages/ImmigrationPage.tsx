import {
  Award,
  Briefcase,
  Building2,
  FileText,
  Handshake,
  IdCard,
  MessageCircle,
  Scale,
  Send,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PillarHero } from "@/components/common/PillarHero";
import { PillarProcessSteps } from "@/components/common/PillarProcessSteps";
import { RelatedTopicLink } from "@/components/common/RelatedTopicLink";
import { ServicesShowcase } from "@/components/common/ServicesShowcase";
import { WhyStrip } from "@/components/common/WhyStrip";
import heroImage from "@/assets/images/about/about_teaser.webp";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const SERVICES = [
  {
    icon: Briefcase,
    title: "Employment Visas",
    description: "Professional assistance with employment visa applications, processing and renewals.",
  },
  {
    icon: Users,
    title: "Investor & Partner Visas",
    description: "Support for investors, business owners and partners seeking UAE residency.",
  },
  {
    icon: Handshake,
    title: "Family & Dependent Visas",
    description: "Assistance with sponsoring eligible family members and managing dependent residency procedures.",
  },
  {
    icon: Send,
    title: "Visa Renewal & Cancellation",
    description: "Timely support for renewing or cancelling UAE visas and completing the required formalities.",
  },
  {
    icon: FileText,
    title: "Entry Permits & Status Change",
    description: "Assistance with entry permits and applicable visa status adjustment procedures.",
  },
  {
    icon: Building2,
    title: "Establishment Card Services",
    description: "Support with establishment card applications, renewals and related immigration procedures.",
  },
  {
    icon: IdCard,
    title: "Emirates ID Assistance",
    description: "Guidance and administrative support related to Emirates ID applications and residency procedures.",
  },
];

// Marketing landing page — deliberately not in the Navbar. Built from UAE
// Immigration Page.docx's "Immigration System" section, DSD's own services pitch
// (condensed, not invented). The doc's other block — the regulatory primer
// (pillars/authorities/penalties) — lives at the linked /immigration/regulations
// sub-route, sharing RegulatoryPrimer with MOHREPage rather than duplicating that
// section here. No per-service detail pages exist for these 7 items (out of scope),
// so each links to the embedded #lead-form instead of a route that doesn't exist —
// per ui-rules.md's "never build a UI affordance for something not implemented."
export function ImmigrationPage() {
  useDocumentTitle("Immigration");

  const showcaseItems = SERVICES.map((service) => ({ ...service, to: "#lead-form" }));

  return (
    <>
      <PillarHero
        image={heroImage}
        eyebrow="Immigration Services"
        title="UAE Immigration,"
        highlight="Made Simple."
        description="Moving, working, investing, or building a life in the UAE comes with important immigration requirements. DSD Corporate Services provides professional support for UAE visa and residency procedures — from initial applications to renewals, amendments, and cancellations."
        quickLinks={[
          { icon: Briefcase, label: "Employment Visas", to: "#lead-form" },
          { icon: Users, label: "Investor Visas", to: "#lead-form" },
          { icon: Handshake, label: "Family Visas", to: "#lead-form" },
          { icon: Building2, label: "Establishment Card", to: "#lead-form" },
        ]}
        primaryCta={{ label: "Get Immigration Assistance", to: "#lead-form" }}
        secondaryCta={{ label: "Speak to Our Experts", to: "/contact" }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <RelatedTopicLink
          icon={Scale}
          title="Understand UAE Immigration Law"
          description="Entry/residence visa rules, the ICP & GDRFA authorities, and the compliance penalties employers and sponsors should know."
          to="/immigration/regulations"
          ctaLabel="Read the Legal Framework"
        />
      </div>

      <WhyStrip
        title="Why Choose DSD?"
        description="Complete immigration support for entrepreneurs, investors, employers, employees, and family members."
        items={[
          { icon: UserCheck, title: "Expert Guidance", description: "Our team helps you understand the process and required documentation." },
          { icon: Send, title: "Efficient Processing", description: "We manage submissions and follow-ups to help reduce unnecessary delays." },
          { icon: ShieldCheck, title: "End-to-End Support", description: "From application to completion, we remain available throughout the process." },
          { icon: Building2, title: "Business-Focused Service", description: "We help companies manage employee and residency requirements while they focus on business." },
        ]}
      />

      <ServicesShowcase
        title="Our Immigration Services"
        description="Whether you're an entrepreneur, investor, employer, employee, or family member, DSD assists throughout your immigration journey."
        items={showcaseItems}
        photoCard={{
          image: heroImage,
          title: "Your UAE Residency Journey Starts Here",
          description:
            "Let DSD Corporate Services take care of the administrative process while you focus on your life and business in the UAE.",
          ctaLabel: "Learn About the Legal Framework",
          ctaTo: "/immigration/regulations",
        }}
      />

      <section id="lead-form" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 md:px-6">
        <LeadForm
          defaultMainService="residency"
          title="Get Immigration Assistance"
          description="Share your visa or residency requirement and our team will guide you through the right process."
        />
      </section>

      <PillarProcessSteps
        description="A simple, clear process to get your UAE immigration matter handled correctly."
        steps={[
          { icon: MessageCircle, title: "Consultation", description: "Discuss your immigration need." },
          { icon: FileText, title: "Documentation", description: "Prepare the required documents." },
          { icon: Send, title: "Submission", description: "Lodge with ICP/GDRFA or MOHRE." },
          { icon: Settings, title: "Processing", description: "We track and follow up on your behalf." },
          { icon: Award, title: "Approval", description: "Receive your visa or permit." },
          { icon: Handshake, title: "Ongoing Support", description: "We're here for renewals and changes." },
        ]}
      />

      <section className="relative bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: `url(${heroImage})` }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(10,27,51,0.88) 0%, rgba(10,27,51,0.55) 60%, rgba(10,27,51,0.35) 100%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center md:px-6">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Your UAE Residency Journey Starts Here</h2>
          <p className="max-w-xl text-white/80">
            Let DSD Corporate Services take care of the administrative process while you focus on your life and business in
            the UAE.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#lead-form" className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark">
              Get Immigration Assistance
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
