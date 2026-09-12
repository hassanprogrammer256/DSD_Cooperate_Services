import { useState } from "react";

import Button from "@mui/joy/Button";
import {
  Briefcase,
  CalendarClock,
  CircleCheck,
  Receipt,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
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

// ---------------------------------------------------------------------------
// DSD copy fields (subtitle, "Best For", highlight callouts, per-tier CTA
// text, fee disclaimers) aren't part of the current pricing-tier API
// response yet. Rather than block this redesign on a backend change, each
// field is read off the tier object first (`tier as PricingTierExtras`) and
// falls back to the copy from pricing.txt, keyed by tier name. Once the API
// starts returning these fields, they take over automatically and this
// fallback map can be deleted.
// ---------------------------------------------------------------------------

type PricingTierExtras = {
  subtitle?: string;
  bestFor?: string;
  highlightTitle?: string;
  highlightBody?: string;
  ctaLabel?: string;
  feesNote?: string;
};

const TIER_CONTENT_FALLBACKS: Record<string, Required<PricingTierExtras>> = {
  basic: {
    subtitle: "Pay Per Service",
    bestFor: "Startups | Freelancers | Small Businesses | One-Off Requirements",
    highlightTitle: "",
    highlightBody: "",
    ctaLabel: "Request a PRO Service",
    feesNote: "Government and third-party fees are charged separately at actual cost.",
  },
  growth: {
    subtitle: "Monthly PRO Retainer",
    bestFor: "Growing SMEs | 1–10 Employees | Businesses With Regular PRO Requirements",
    highlightTitle: "Why Growth?",
    highlightBody:
      "Instead of paying separately every time you need assistance, your business has a dedicated PRO support channel throughout the month.",
    ctaLabel: "Choose Growth",
    feesNote: "Government and third-party fees are charged separately at actual cost.",
  },
  enterprise: {
    subtitle: "Annual PRO Partnership",
    bestFor: "Established SMEs | Multiple Employees | Companies with Recurring Government Requirements",
    highlightTitle: "Annual Advantage",
    highlightBody:
      "Pay once and maintain continuous PRO support throughout the year with a predictable professional-services budget.",
    ctaLabel: "Become an Enterprise Client",
    feesNote: "Government, authority and third-party fees are excluded and billed separately at actual cost.",
  },
};

const DEFAULT_TIER_CONTENT: Required<PricingTierExtras> = {
  subtitle: "",
  bestFor: "",
  highlightTitle: "",
  highlightBody: "",
  ctaLabel: "Get Started",
  feesNote: "Government and third-party fees are charged separately at actual cost.",
};

function getTierContent<Tier extends { name: string }>(tier: Tier): Required<PricingTierExtras> {
  const apiExtras = tier as Tier & PricingTierExtras;
  const fallback =
    TIER_CONTENT_FALLBACKS[tier.name?.toLowerCase().trim() ?? ""] ?? DEFAULT_TIER_CONTENT;

  return {
    subtitle: apiExtras.subtitle ?? fallback.subtitle,
    bestFor: apiExtras.bestFor ?? fallback.bestFor,
    highlightTitle: apiExtras.highlightTitle ?? fallback.highlightTitle,
    highlightBody: apiExtras.highlightBody ?? fallback.highlightBody,
    ctaLabel: apiExtras.ctaLabel ?? fallback.ctaLabel,
    feesNote: apiExtras.feesNote ?? fallback.feesNote,
  };
}

const WHY_DSD_POINTS = [
  {
    icon: ShieldCheck,
    title: "Professional Support",
    description: "Experienced assistance for routine UAE government procedures.",
  },
  {
    icon: UserCheck,
    title: "One Point of Contact",
    description: "A single team to coordinate your PRO requirements.",
  },
  {
    icon: Receipt,
    title: "Transparent Pricing",
    description: "Our professional service fees are clearly separated from government and third-party charges.",
  },
  {
    icon: CalendarClock,
    title: "Deadline Management",
    description: "We help you stay aware of important renewal and expiry dates.",
  },
  {
    icon: Briefcase,
    title: "Business Convenience",
    description: "Reduce paperwork, follow-ups and unnecessary administrative workload.",
  },
];

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
        eyebrow="PRO Services Retainer"
        title="Your Government Work. Our Responsibility."
        description="Government procedures shouldn't take your valuable time away from running your business. Choose the level of support that fits your business — from a single service to a complete annual PRO partnership."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          {/* Quick-compare strip: a scannable summary of the same tiers rendered
              in full below, for anyone who just wants price + one line + a button. */}
 

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingTiers?.map((tier) => {
              const purchasable = tier.amount !== null;
              const isCheckoutOpen = checkoutTierId === tier.id;
              const paidOrder = paidResult?.tierId === tier.id ? paidResult.order : null;
              const content = getTierContent(tier);

              return (
                <div
                  key={tier.id}
                  id={`tier-${tier.id}`}
                  className={`relative flex scroll-mt-24 flex-col rounded-xl border bg-surface p-6 ${
                    tier.highlighted ? "border-accent shadow-lg" : "border-border"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
                      Most Popular
                    </span>
                  )}
                  <h2 className="font-display text-lg font-semibold text-text-primary">{tier.name}</h2>
                  {content.subtitle && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                      {content.subtitle}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-text-secondary">{tier.description}</p>

                  <div className="mt-5">
                    {tier.period && <span className="mr-1 text-xs text-text-muted">{tier.period}</span>}
                    <span className="text-2xl font-bold text-text-primary">{tier.price}</span>
                  </div>

                  <ul className="mt-5 flex flex-col gap-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CircleCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {content.bestFor && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Best For</p>
                      <p className="mt-1 text-sm text-text-secondary">{content.bestFor}</p>
                    </div>
                  )}

                  {content.highlightTitle && (
                    <div className="mt-4 rounded-lg bg-accent-light p-4">
                      <p className="text-sm font-semibold text-accent">{content.highlightTitle}</p>
                      <p className="mt-1 text-sm text-text-secondary">{content.highlightBody}</p>
                    </div>
                  )}

                  <div className="flex-1" />

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
                          {content.ctaLabel}
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
                          {content.ctaLabel}
                        </Button>
                      )}
                    </div>
                  )}

                  {content.feesNote && <p className="mt-3 text-xs text-text-muted">{content.feesNote}</p>}
                </div>
              );
            })}
          </div>
        </QueryState>

        {/* Why Choose DSD */}
        <div className="mt-20 text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            One Partner. Multiple Government Requirements.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary">
            With DSD Corporate Services, you don't need to manage every government procedure yourself. Our PRO team
            helps coordinate the administrative side of your business so you can spend more time on clients,
            employees and growth.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_DSD_POINTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-border bg-surface p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-light">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-text-primary">{title}</h3>
              <p className="mt-1 text-xs text-text-secondary">{description}</p>
            </div>
          ))}
        </div>

        {/* Government fees disclaimer */}
        <div className="mt-16 rounded-xl border border-border bg-surface p-6 md:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
            Government Fees Are Always Separate
          </h3>
          <p className="mt-3 text-sm text-text-secondary">
            DSD professional service fees cover our PRO administration and support. Government fees, authority
            charges, medical examinations, Emirates ID fees, typing-centre charges, courier fees, attestation
            charges and other third-party costs are not included unless specifically stated in a written
            quotation.
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            All applicable government and third-party charges should be approved by the client before processing.
          </p>
        </div>

        {/* Closing CTA */}
        <div className="mt-16 flex flex-col items-center rounded-xl bg-accent-light px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
            Ready to Simplify Your Government Administration?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-secondary">
            Let DSD Corporate Services manage the paperwork while you focus on your business.
          </p>
          <CtaButton to="/contact" sx={{ mt: 5 }}>
            Talk to DSD PRO Services
          </CtaButton>
        </div>
      </div>
    </>
  );
}
