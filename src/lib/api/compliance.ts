import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { ComplianceArea } from "@/types";

// Curates which compliance areas the /compliance hub grid (and the Navbar's Compliance
// dropdown) show — same "fixed site structure, not staff-editable" reasoning as
// servicePillarMeta. Replaced 2026-09-09 per the client's mobile-structure spec: the
// previous 7 areas are still live in the database (reachable by direct URL), just no
// longer linked from the hub/nav in favor of these 6 curated ones. See
// progress-tracker.md's 2026-09-09 entry.
export const curatedComplianceAreas: { slug: string; label: string }[] = [
  { slug: "corporate-compliance", label: "Corporate Compliance" },
  { slug: "accounting-reporting", label: "Accounting & Reporting" },
  { slug: "tax-compliance", label: "Tax Compliance" },
  { slug: "aml-kyc-compliance", label: "AML / KYC" },
  { slug: "regulatory-support", label: "Regulatory Support" },
  { slug: "annual-compliance", label: "Annual Compliance" },
];

export const curatedComplianceSlugs = curatedComplianceAreas.map((area) => area.slug);

export const complianceKeys = {
  all: ["compliance-areas"] as const,
  detail: (slug: string) => ["compliance-areas", slug] as const,
};

export function useComplianceAreasQuery() {
  return useQuery({
    queryKey: complianceKeys.all,
    queryFn: () => apiClient.get<ComplianceArea[]>("/api/compliance-areas/"),
  });
}

export function useComplianceAreaDetailQuery(slug: string) {
  return useQuery({
    queryKey: complianceKeys.detail(slug),
    queryFn: () => apiClient.get<ComplianceArea>(`/api/compliance-areas/${slug}/`),
  });
}
