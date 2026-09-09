import { Mail, MapPin, Phone } from "lucide-react";

import contactPhoto from "@/assets/images/contact2.webp";
import placeholderPhoto from "@/assets/images/contact1.png";
import { CtaButton } from "@/components/common/CtaButton";
import { LeadForm } from "@/components/common/LeadForm";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const OFFICE_ADDRESS = "1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai, UAE";
const MAPS_URL = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}`;

export function ContactPage() {
  useDocumentTitle("Contact");

  return (
    <>
      <PageHeroBanner
        image={placeholderPhoto}
        eyebrow="Get in Touch"
        title="Contact DSD"
        description="Tell us what you're trying to do in the UAE, and we'll respond within one business day."
      />

      <section className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <LeadForm
          title="Send Us a Message"
          description="Tell us what you're trying to do in the UAE and our team will get back to you within one business day."
        />
      </section>

      <section className="border-y border-border bg-surface-secondary px-4 py-10 text-center md:px-6">
        <p className="mx-auto max-w-2xl text-text-secondary">
          Prefer to talk now? Call us at{" "}
          <a href="tel:+971585889033" className="font-mono font-semibold text-primary hover:opacity-80">
            +971 58 588 9033
          </a>{" "}
          — or send the form above and we'll respond within one business day.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:px-6 lg:grid-cols-2">
        <img src={contactPhoto} alt="Two people shaking hands" className="w-full rounded-xl object-cover" />

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">Visit Our Office</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary md:text-3xl">We're based in Dubai</h2>
          <p className="mt-3 text-text-secondary">
            Drop by, call, or email — whichever's easiest. We typically respond to every enquiry within one business
            day.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-text-secondary hover:text-primary"
            >
              <MapPin size={20} className="mt-0.5 shrink-0 text-primary" />
              <span>{OFFICE_ADDRESS}</span>
            </a>
            <a href="tel:+971585889033" className="flex items-center gap-3 text-text-secondary hover:text-primary">
              <Phone size={20} className="shrink-0 text-primary" />
              <span className="font-mono">+971 58 588 9033</span>
            </a>
            <a href="mailto:info@dsdcop.com" className="flex items-center gap-3 text-text-secondary hover:text-primary">
              <Mail size={20} className="shrink-0 text-primary" />
              <span>info@dsdcop.com</span>
            </a>
          </div>

          <div className="mt-8">
            <CtaButton to="/pricing">View Pricing</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
