import { CtaButton } from "@/components/common/CtaButton";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function PartnerWithUsPage() {
  useDocumentTitle("Partner With Us");

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
      <h1 className="font-display text-3xl font-bold text-text-primary">Partner With Us</h1>
      <p className="mt-4 text-text-secondary">
        Refer a client to DSD and we'll keep you informed every step of the way. Full referral programme details
        ship in a later build phase.
      </p>
      <div className="mt-8">
        <CtaButton to="/contact">Get in Touch</CtaButton>
      </div>
    </section>
  );
}
