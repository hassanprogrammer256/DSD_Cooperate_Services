import { useState } from "react";

import Button from "@mui/joy/Button";
import { CircleCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";
import { PageHeroBanner } from "@/components/common/PageHeroBanner";
import { QueryState } from "@/components/common/QueryState";
import { TapCheckoutPanel } from "@/components/pricing/TapCheckoutPanel";
import pricingHero from "@/assets/images/hero/pricing_hero.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { usePricingTiersQuery } from "@/lib/api/pricing";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { Order } from "@/types";

export function PricingPage() {
  useDocumentTitle("Pricing");
  const { data: pricingTiers, isLoading, isError, refetch } = usePricingTiersQuery();
  const { user, isBootstrapping } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL's own ?checkout=<tierId> IS the "which tier's checkout is open" state,
  // rather than a separate useState synced from it via an effect. This survives
  // /login -> /register -> back-to-/pricing (a real remount each time the route
  // changes) for free — no effect-timing race to get right, since there's no local
  // state to lose. See ui-rules.md ("lands back on /pricing with their selected tier
  // still in view") and progress-tracker.md's Phase 13 entry for why an earlier
  // effect-based version of this was flaky (AnimatePresence's exit/enter cycle in
  // App.tsx could remount this page a beat after the effect set local state, wiping it).
  const checkoutTierId = !isBootstrapping && user ? searchParams.get("checkout") : null;
  const [paidResult, setPaidResult] = useState<{ tierId: string; order: Order } | null>(null);

  function clearCheckout() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("checkout");
        return next;
      },
      { replace: true },
    );
  }

  function handleBuyNow(tierId: string) {
    if (!user) {
      navigate("/login", { state: { from: `/pricing?checkout=${tierId}` } });
      return;
    }
    setPaidResult(null);
    setSearchParams({ checkout: tierId }, { replace: true });
  }

  return (
    <>
      <PageHeroBanner
        image={pricingHero}
        eyebrow="Pricing"
        title="Advisory Packages"
        description="Fixed-scope pricing across residency, incorporation, and compliance — pay securely online, or talk to us first for anything bespoke."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers?.map((tier) => {
              const purchasable = tier.amount !== null;
              const isCheckoutOpen = checkoutTierId === tier.id;
              const paidOrder = paidResult?.tierId === tier.id ? paidResult.order : null;

              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-xl border bg-surface p-6 ${
                    tier.highlighted ? "border-accent shadow-lg" : "border-border"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
                      Most Popular
                    </span>
                  )}
                  <h2 className="font-display text-lg font-semibold text-text-primary">{tier.name}</h2>
                  <p className="mt-2 text-sm text-text-secondary">{tier.description}</p>

                  <div className="mt-5">
                    {tier.period && <span className="mr-1 text-xs text-text-muted">{tier.period}</span>}
                    <span className="text-2xl font-bold text-text-primary">{tier.price}</span>
                  </div>

                  <ul className="mt-5 flex flex-1 flex-col gap-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CircleCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {paidOrder ? (
                    <div className="mt-6 rounded-lg border border-success bg-success-light p-4 text-center">
                      <p className="text-sm font-semibold text-success">Payment received — order #{paidOrder.id}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {tier.name} · {paidOrder.currency} {paidOrder.amount}
                      </p>
                      <CtaButton to="/account" sx={{ mt: 3 }} fullWidth>
                        View in My Account
                      </CtaButton>
                    </div>
                  ) : isCheckoutOpen ? (
                    <TapCheckoutPanel
                      tier={tier}
                      onCancel={clearCheckout}
                      onPaid={(order) => {
                        setPaidResult({ tierId: tier.id, order });
                        clearCheckout();
                      }}
                    />
                  ) : (
                    <div className="mt-6">
                      {purchasable ? (
                        <CtaButton type="button" onClick={() => handleBuyNow(tier.id)} fullWidth>
                          Buy Now
                        </CtaButton>
                      ) : (
                        <Button
                          component={Link}
                          to="/contact"
                          variant="outlined"
                          color="neutral"
                          fullWidth
                          sx={{
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-border)",
                            "&:hover": { borderColor: "var(--color-primary)", backgroundColor: "transparent" },
                          }}
                        >
                          Get Started
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </QueryState>
      </div>
    </>
  );
}
