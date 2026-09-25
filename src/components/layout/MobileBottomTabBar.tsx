import { Building2, Handshake, House, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { WhatsappIcon } from "@/components/common/SocialIcon";

const WHATSAPP_URL = "https://wa.me/971585889033";

const TABS = [
  { to: "/", label: "Home", icon: House },
  { to: "/residency", label: "Services", icon: Building2 },
  { to: "/partner-with-us", label: "Partner", icon: Handshake },
  { to: "/contact", label: "Contact", icon: Phone },
];

// Mobile-only (lg:hidden) — new 2026-09-09, per the client's mobile-structure spec's
// "Mobile Footer" section. App.tsx pads page content by this bar's height (h-16) on
// mobile so it never overlaps the last section of a page.
export function MobileBottomTabBar() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-surface shadow-[0_-2px_8px_rgba(11,23,48,0.08)] lg:hidden">
      {TABS.map((tab) => {
        const isActive = tab.to === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.to);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              isActive ? "text-accent" : "text-text-secondary"
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </Link>
        );
      })}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-text-secondary"
      >
        <WhatsappIcon size={20} />
        WhatsApp
      </a>
    </nav>
  );
}
