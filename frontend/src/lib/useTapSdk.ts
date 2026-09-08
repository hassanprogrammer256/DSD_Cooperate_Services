import { useEffect, useState } from "react";

// Tap's actual current SDK (confirmed against Tap's live docs during Phase 13, not
// the stale goSell.js example library-docs.md previously had) — Tapjsli() + elements()
// + createToken(), loaded from these two scripts, in this order.
export type TapCardElement = {
  mount: (selector: string) => void;
  unmount?: () => void;
};

export type TapCreateTokenResult = { id: string; error?: undefined } | { id?: undefined; error: { message: string } };

export type TapInstance = {
  elements: (options: Record<string, unknown>) => {
    create: (type: "card", styleOptions: Record<string, unknown>, paymentOptions: Record<string, unknown>) => TapCardElement;
  };
  createToken: (element: TapCardElement) => Promise<TapCreateTokenResult>;
};

declare global {
  interface Window {
    Tapjsli?: (publicKey: string) => TapInstance;
  }
}

const TAP_SCRIPTS = ["https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js", "https://secure.gosell.io/js/sdk/tap.min.js"];

let loadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadTapSdk(): Promise<void> {
  loadPromise ??= TAP_SCRIPTS.reduce<Promise<void>>((chain, src) => chain.then(() => loadScript(src)), Promise.resolve());
  return loadPromise;
}

export type TapSdkStatus = "loading" | "ready" | "error";

// Loaded on demand (only once the Pricing page's checkout step actually opens), not
// on every Pricing page visit — see ui-rules.md's Pricing Page section. `enabled: false`
// (no VITE_TAP_PUBLIC_KEY configured) skips the network fetch entirely rather than
// loading a third-party script that can't be used anyway.
export function useTapSdk(enabled = true): TapSdkStatus {
  const [status, setStatus] = useState<TapSdkStatus>("loading");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    loadTapSdk()
      .then(() => {
        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return status;
}
