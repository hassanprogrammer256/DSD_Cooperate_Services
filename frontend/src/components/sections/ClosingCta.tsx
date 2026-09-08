import { CtaButton } from "@/components/common/CtaButton";

export function ClosingCta() {
  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center md:px-6 md:py-20">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Ready to start your UAE journey?</h2>
        <p className="max-w-xl text-white/72">
          Tell us what you're trying to do and we'll tell you the fastest, most compliant way to get there.
        </p>
        <CtaButton to="/contact" size="lg">
          Book a Consultation
        </CtaButton>
      </div>
    </section>
  );
}
