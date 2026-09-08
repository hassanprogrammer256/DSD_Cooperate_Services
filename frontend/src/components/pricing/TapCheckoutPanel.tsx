import { useEffect, useRef, useState } from "react";

import Button from "@mui/joy/Button";

import { CtaButton } from "@/components/common/CtaButton";
import { ApiError } from "@/lib/api/client";
import { useCreateOrderMutation } from "@/lib/api/orders";
import { useTapSdk, type TapCardElement, type TapInstance } from "@/lib/useTapSdk";
import type { Order, PricingTier } from "@/types";

type TapCheckoutPanelProps = {
  tier: PricingTier;
  onCancel: () => void;
  onPaid: (order: Order) => void;
};

const TAP_PUBLIC_KEY = import.meta.env.VITE_TAP_PUBLIC_KEY as string;

export function TapCheckoutPanel({ tier, onCancel, onPaid }: TapCheckoutPanelProps) {
  const sdkStatus = useTapSdk(!!TAP_PUBLIC_KEY);
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const tapRef = useRef<TapInstance | null>(null);
  const cardRef = useRef<TapCardElement | null>(null);
  const createOrderMutation = useCreateOrderMutation();
  const containerId = `tap-card-element-${tier.id}`;

  useEffect(() => {
    if (sdkStatus !== "ready" || !TAP_PUBLIC_KEY || !window.Tapjsli) return;
    const tap = window.Tapjsli(TAP_PUBLIC_KEY);
    const elements = tap.elements({});
    const card = elements.create("card", {}, {});
    card.mount(`#${containerId}`);
    tapRef.current = tap;
    cardRef.current = card;
    setMounted(true);
    return () => {
      card.unmount?.();
      tapRef.current = null;
      cardRef.current = null;
      setMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount only when the SDK finishes loading, not on every render
  }, [sdkStatus]);

  async function handlePay() {
    if (!tapRef.current || !cardRef.current) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await tapRef.current.createToken(cardRef.current);
      if (result.error) {
        setErrorMessage(result.error.message);
        return;
      }
      const order = await createOrderMutation.mutateAsync({ pricingTierId: tier.id, tapToken: result.id });
      onPaid(order);
    } catch (err) {
      console.error("[TapCheckoutPanel/handlePay]", err);
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Something went wrong — please try again or contact info@dsdcop.com",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!TAP_PUBLIC_KEY) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-surface-secondary p-4 text-center text-sm text-text-secondary">
        Online payment isn't configured in this environment yet.
        <div className="mt-3 flex justify-center gap-2">
          <CtaButton to="/contact" size="sm">
            Contact Us Instead
          </CtaButton>
          <Button type="button" size="sm" variant="outlined" color="neutral" onClick={onCancel} sx={{ color: "var(--color-text-primary)", borderColor: "var(--color-border)" }}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-secondary p-4">
      <p className="text-sm text-text-secondary">
        Paying <span className="font-semibold text-text-primary">{tier.price}</span> for{" "}
        <span className="font-semibold text-text-primary">{tier.name}</span>
      </p>

      <div id={containerId} className="mt-3 min-h-11 rounded-md border border-border bg-surface p-3">
        {sdkStatus === "loading" && <p className="text-xs text-text-muted">Loading secure card entry…</p>}
        {sdkStatus === "error" && (
          <p className="text-xs text-error">Couldn't load the payment form — please refresh and try again.</p>
        )}
      </div>

      {errorMessage && <p className="mt-3 text-sm text-error">{errorMessage}</p>}

      <div className="mt-4 flex gap-2">
        <CtaButton
          type="button"
          loading={submitting}
          disabled={submitting || !mounted}
          onClick={() => void handlePay()}
          sx={{ flex: 1 }}
        >
          Pay {tier.price}
        </CtaButton>
        <Button
          type="button"
          variant="outlined"
          color="neutral"
          disabled={submitting}
          onClick={onCancel}
          sx={{ color: "var(--color-text-primary)", borderColor: "var(--color-border)" }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
