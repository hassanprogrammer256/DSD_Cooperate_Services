import { Mail, MapPin, Phone } from "lucide-react";

import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ContactPage() {
  useDocumentTitle("Contact");

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Contact DSD</h1>
        <p className="mt-4 text-text-secondary">The consultation-request form ships in a later build phase — reach us directly for now.</p>
      </div>

      <div className="mx-auto mt-12 flex max-w-md flex-col gap-4">
        <div className="flex items-start gap-3 text-sm text-text-secondary">
          <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
          <span>1st Floor, Office 06, Al Habeb Building, Umm Hurair Street, Oud Metha, Dubai, UAE</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Phone size={18} className="shrink-0 text-primary" />
          <a href="tel:+971585889033" className="font-mono hover:text-primary">
            +971 58 588 9033
          </a>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Mail size={18} className="shrink-0 text-primary" />
          <a href="mailto:info@dsdcop.com" className="hover:text-primary">
            info@dsdcop.com
          </a>
        </div>
      </div>
    </section>
  );
}
