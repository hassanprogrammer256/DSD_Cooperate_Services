import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { InsightArticle } from "@/types";

export const insightsKeys = {
  all: ["insights"] as const,
  detail: (slug: string) => ["insights", slug] as const,
};

export function useInsightsQuery() {
  return useQuery({
    queryKey: insightsKeys.all,
    queryFn: () => apiClient.get<InsightArticle[]>("/api/insights/"),
  });
}

export function useInsightDetailQuery(slug: string) {
  return useQuery({
    queryKey: insightsKeys.detail(slug),
    queryFn: () => apiClient.get<InsightArticle>(`/api/insights/${slug}/`),
  });
}
