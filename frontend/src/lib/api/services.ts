import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Service, ServicePillar } from "@/types";

// Deliberately NOT fetched from the API — the 3 pillars and their descriptions are
// fixed site structure, not staff-editable content (same reasoning as PhilosophyStrip's
// hardcoded differentiators). Lives here only so Navbar/ServicesPage's existing import
// path keeps working after the Phase 11 migration off src/data/services.ts.
export const servicePillarMeta: { pillar: ServicePillar; label: string; description: string }[] = [
  {
    pillar: "residency-by-property",
    label: "Residency by Property",
    description: "Secure long-term UAE residency by owning a qualifying property — no employer or business operations required.",
  },
  {
    pillar: "residency-by-business",
    label: "Residency by Business",
    description: "Explore the various ways your business can lead to UAE residency, including investment and employment opportunities.",
  },
  {
    pillar: "residency-by-employment",
    label: "Residency by Employment",
    description: "Learn how securing a job in the UAE can be a pathway to residency, with insights into visa requirements and processes.",
  },
  {
    pillar: "residency-by-family-sponsorship",
    label: "Residency by Family Sponsorship",
    description: "Understand how family ties can facilitate UAE residency, including the steps and documentation required.",
  },

];

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
