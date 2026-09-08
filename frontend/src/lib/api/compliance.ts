import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { ComplianceArea } from "@/types";

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
