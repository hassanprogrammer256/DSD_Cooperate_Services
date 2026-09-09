import { Mail, Phone } from "lucide-react";

import { WhatsappIcon } from "@/components/common/SocialIcon";

const WHATSAPP_URL = "https://wa.me/971585889033";

// Mobile-only (lg:hidden) — new 2026-09-09, per the client's mobile-structure spec's
// "Fixed Mobile Actions" row. Sits above MobileBottomTabBar (bottom-20, clearing its
// h-16) so the two fixed elements never overlap. WhatsApp is the primary/largest
// action (accent) — Call and Enquire are secondary (primary navy), not three
// equally-loud buttons, per ui-tokens.md's "accent is reserved for the one action that
// matters most" discipline.
export function MobileFloatingActions() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:hidden">
      <a
        href="mailto:info@dsdcop.com"
        aria-label="Enquire by email"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg"
      >
        <Mail size={18} />
      </a>
      <a
        href="tel:+971585889033"
        aria-label="Call DSD"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg"
      >
        <Phone size={18} />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg"
      >
        <WhatsappIcon size={26} />
      </a>
    </div>
  );
}
