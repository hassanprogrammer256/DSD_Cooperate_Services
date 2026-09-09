import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { IncorporationPillar, Service, ServicePillar } from "@/types";

// Deliberately NOT fetched from the API — these pillar labels/descriptions are fixed
// site structure, not staff-editable content (same reasoning as PhilosophyStrip's
// hardcoded differentiators). Each `pillar` value is a specific, curated Service slug
// (see ServicesPage.tsx), not the backend Service.pillar enum.
//
// Replaced 2026-09-09 per the client's mobile-structure spec: the 4 residency-by-*
// services are no longer linked from nav/the /residency hub (still live in the
// database, reachable by direct URL — nothing was deleted) in favor of these 5 curated
// items. See progress-tracker.md's 2026-09-09 entry for the full reasoning.
export const servicePillarMeta: { pillar: ServicePillar; label: string; description: string }[] = [
  {
    pillar: "uae-residency",
    label: "UAE Residency",
    description: "Not sure which route fits? Start here — we scope your situation against every UAE residency pathway before recommending one.",
  },
  {
    pillar: "investor-residency",
    label: "Investor Residency",
    description: "Residency earned through capital — a qualifying property purchase, business investment, or company ownership.",
  },
  {
    pillar: "family-residency",
    label: "Family Residency",
    description: "Sponsor your spouse, children, or parents under your own UAE residency status.",
  },
  {
    pillar: "golden-residency",
    label: "Golden Residency",
    description: "The UAE's long-term residency visa for qualifying investors, property owners, and specialised talent — up to 10 years, renewable.",
  },
  {
    pillar: "residency-support",
    label: "Residency Support",
    description: "Ongoing residency administration after approval — renewals, status changes, and cancellations.",
  },
];

// Same pattern as servicePillarMeta, for the new /incorporation hub (see
// IncorporationPage.tsx) — new 2026-09-09.
export const incorporationPillarMeta: { pillar: IncorporationPillar; label: string; description: string }[] = [
  {
    pillar: "company-formation",
    label: "Company Formation",
    description: "End-to-end UAE company setup — from choosing mainland or free zone to your first trade licence.",
  },
  {
    pillar: "business-licensing",
    label: "Business Licensing",
    description: "Trade licence renewal, activity amendments, and additional-activity filings for a company already operating.",
  },
  {
    pillar: "international-structures",
    label: "International Structures",
    description: "Branch registration, holding structures, and multi-jurisdiction setups for companies already operating outside the UAE.",
  },
  {
    pillar: "corporate-structuring",
    label: "Corporate Structuring",
    description: "Shareholding, governance, and management structuring for a company being formed or reorganised.",
  },
  {
    pillar: "corporate-documentation",
    label: "Corporate Documentation",
    description: "MOA/AOA drafting, resolutions, and the constitutional paperwork every UAE company has to keep current.",
  },
];

// Every currently-curated service slug, across both hubs — used to filter the Footer's
// Services column down to the same set the Navbar/hub pages link, per the "old content
// stays in the database, unlinked" decision (see progress-tracker.md's 2026-09-09 entry).
export const curatedServiceSlugs = [
  ...servicePillarMeta.map((p) => p.pillar as string),
  ...incorporationPillarMeta.map((p) => p.pillar as string),
];

// The real backend Service.pillar enum only ever migrated Business Incorporation to its
// own URL namespace (see ServiceDetailPage.tsx's redirect logic) — every other pillar,
// compliance-governance included, still resolves under /residency.
export function canonicalServicePath(service: Pick<Service, "slug" | "pillar">): string {
  const prefix = service.pillar === "business-incorporation" ? "/incorporation" : "/residency";
  return `${prefix}/${service.slug}`;
}

export const servicesKeys = {
  all: ["services"] as const,
  detail: (slug: string) => ["services", slug] as const,
};

export function useServicesQuery() {
  return useQuery({
    queryKey: servicesKeys.all,
    queryFn: () => apiClient.get<Service[]>("/api/services/"),
  });
}

export function useServiceDetailQuery(slug: string) {
  return useQuery({
    queryKey: servicesKeys.detail(slug),
    queryFn: () => apiClient.get<Service>(`/api/services/${slug}/`),
  });
}
