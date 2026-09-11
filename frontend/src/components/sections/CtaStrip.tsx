import { CtaButton } from "../common/CtaButton";

export function CtaStrip() {
  return (
    <div className="bg-primary">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-center sm:flex-row sm:text-left md:px-6">
        <p className="text-sm font-medium text-white">Not sure where to start? Consult the Experts</p>
     <CtaButton to="/contact" size="lg">
          Book a Consultation
        </CtaButton>
      </div>
    </div>
  );
}
