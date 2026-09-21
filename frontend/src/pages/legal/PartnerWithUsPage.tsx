import { Award, Briefcase, Building2, Clock, Globe, Handshake, Send, ShieldCheck, UserCheck, Users } from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { ProcessSteps } from "@/components/common/ProcessSteps";
import { SentenceText } from "@/components/common/SentenceText";
import { WhyChooseDsd } from "@/components/common/WhyChooseDsd";
import placeholderPhoto from "@/assets/images/contact1.png";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const PARTNER_TYPES = [
  {
    icon: Handshake,
    title: "Referral Partners",
    description: "Introduce a client to DSD and receive referral benefits under our agreed programme terms once they come on board.",
  },
  {
    icon: Briefcase,
    title: "Professional Partners",
    description: "Lawyers, accountants  advisors whose clients regularly need UAE company-formation or residency support.",
  },
  {
    icon: Building2,
    title: "Corporate Partners",
    description: "Companies that regularly refer their own clients, staff or portfolio businesses for UAE incorporation and residency.",
  },
  {
    icon: Globe,
    title: "International Partners",
    description: "Overseas advisors and agencies supporting clients relocating to or expanding into, the UAE.",
  },
  {
    icon: Users,
    title: "Business Introductions",
    description: "A simple introduction to a founder or business considering the UAE, no formal agreement required to start.",
  },
];

const PARTNER_STEPS = [
  { step: "1", icon: UserCheck, title: "Sign Up", description: "Share your details with us and receive your unique referral link." },
  { step: "2", icon: Send, title: "Share", description: "Introduce DSD to founders, professionals or businesses entering the UAE." },
  { step: "3", icon: Handshake, title: "We Take It From There", description: "Our team handles the consultation, documentation and coordination." },
  { step: "4", icon: Award, title: "Get Rewarded", description: "Once your referral becomes a client, you receive benefits under our programme terms." },
];

const PARTNER_BENEFITS = [
  { icon: ShieldCheck, title: "Transparent Terms", description: "Clear referral terms and a reward structure defined upfront." },
  { icon: Clock, title: "Fast Client Onboarding", description: "We respond to your referrals within one business day." },
  { icon: Globe, title: "International Reach", description: "Partner with us from anywhere, our process is remote-first." },
  { icon: Handshake, title: "Long-Term Relationship", description: "We keep you updated at every stage of your referral's journey." },
];

export function PartnerWithUsPage() {
  useDocumentTitle("Partner With Us");

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Grow With DSD"
        title="Partner With Us"
        description="Grow with DSD Corporate Services by joining our referral network, share opportunities with entrepreneurs and businesses entering the UAE."
      />

      <section className="mx-auto max-w-2xl px-4 pt-16 text-center md:px-6">
        <div className="text-text-secondary">
          <SentenceText text="Share your unique referral link with entrepreneurs and businesses seeking reliable corporate services in the UAE. When your referral becomes a client, you may receive referral benefits in accordance with our agreed programme terms." />
        </div>
        <p className="mt-4 font-display text-base font-semibold text-text-primary">
          Become a partner today and let us succeed together.
        </p>
      </section>

      <WhyChooseDsd
        eyebrow="Partner With DSD"
        title="Multiple Ways to Work Together"
        items={PARTNER_TYPES}
        columns={3}
      />

      <ProcessSteps
        eyebrow="How It Works"
        title="From Introduction to Reward"
        steps={PARTNER_STEPS}
      />

      <WhyChooseDsd
        eyebrow="Why Partner With DSD"
        title="A Programme Built on Clarity"
        items={PARTNER_BENEFITS}
        columns={2}
        background="surface-secondary"
      />

      <section className="mx-auto max-w-3xl px-4 py-16 pb-24 md:px-6">
        <LeadForm
          defaultMainService="partner"
          title="Become a Partner"
          description="Tell us a little about yourself and how you'd like to work with DSD, our partnerships team will be in touch."
        />
        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-text-muted">
          DSD Corporate Services · 1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai,
          United Arab Emirates · +971 58 588 9033 · info@dsdgrp.com
        </p>
      </section>
    </>
  );
}
