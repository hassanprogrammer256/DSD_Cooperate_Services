import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { PricingTier } from "@/types";

export const pricingKeys = {
  all: ["pricing-tiers"] as const,
};

export function usePricingTiersQuery() {
  return useQuery({
    queryKey: pricingKeys.all,
    queryFn: () => apiClient.get<PricingTier[]>("/api/pricing-tiers/"),
  });
}
