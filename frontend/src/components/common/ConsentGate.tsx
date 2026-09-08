import { useState, type ReactNode } from "react";

import Button from "@mui/joy/Button";

// Minimal click-to-load consent gate for embedded third-party content (currently just
// the About page's Google Maps embed) — a deliberately scoped-down stand-in for the
// full 5-category cookie-consent system (CookieConsentBanner/CookieSettingsModal)
// described in ui-registry.md, which hasn't been built yet. See progress-tracker.md.
type Props = {
  category: string;
  title: string;
  description?: string;
  children: ReactNode;
};

function readConsent(category: string): boolean {
  try {
    return localStorage.getItem(`dsd-consent-${category}`) === "true";
  } catch {
    return false;
  }
}

export function ConsentGate({ category, title, description, children }: Props) {
  const [consented, setConsented] = useState(() => readConsent(category));

  function handleAccept() {
    setConsented(true);
    try {
      localStorage.setItem(`dsd-consent-${category}`, "true");
    } catch {
      // localStorage unavailable — consent still applies for this page view
    }
  }

  if (consented) {
    return <>{children}</>;
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary p-8 text-center">
      <p className="font-display text-base font-semibold text-text-primary">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      <Button color="primary" onClick={handleAccept}>
        Load {title}
      </Button>
    </div>
  );
}
