import { Briefcase, Building2, Globe, Handshake, Users } from "lucide-react";

import { LeadForm } from "@/components/common/LeadForm";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
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
    description: "Lawyers, accountants, and advisors whose clients regularly need UAE company-formation or residency support.",
  },
  {
    icon: Building2,
    title: "Corporate Partners",
    description: "Companies that regularly refer their own clients, staff, or portfolio businesses for UAE incorporation and residency.",
  },
  {
    icon: Globe,
    title: "International Partners",
    description: "Overseas advisors and agencies supporting clients relocating to, or expanding into, the UAE.",
  },
  {
    icon: Users,
    title: "Business Introductions",
    description: "A simple introduction to a founder or business considering the UAE — no formal agreement required to start.",
  },
];

export function PartnerWithUsPage() {
  useDocumentTitle("Partner With Us");

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Grow With DSD"
        title="Partner With Us"
        description="Grow with DSD Corporate Services by joining our referral network — share opportunities with entrepreneurs and businesses entering the UAE."
      />

      <section className="mx-auto max-w-2xl px-4 pt-16 text-center md:px-6">
        <p className="text-text-secondary">
          Share your unique referral link with entrepreneurs and businesses seeking reliable corporate services in
          the UAE. When your referral becomes a client, you may receive referral benefits in accordance with our
          agreed programme terms.
        </p>
        <p className="mt-4 font-display text-base font-semibold text-text-primary">
          Become a partner today and let us succeed together.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_TYPES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Icon size={20} />
              </div>
              <p className="mt-4 font-display text-base font-semibold text-text-primary">{title}</p>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
        <LeadForm
          defaultMainService="partner"
          title="Become a Partner"
          description="Tell us a little about yourself and how you'd like to work with DSD — our partnerships team will be in touch."
        />
        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-text-muted">
          DSD Corporate Services · 1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai,
          United Arab Emirates · +971 58 588 9033 · info@dsdcop.com
        </p>
      </section>
    </>
  );
}
