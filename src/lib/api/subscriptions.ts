import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Subscription } from "@/types";

export const subscriptionsKeys = {
  mine: ["subscriptions", "mine"] as const,
};

export function useMySubscriptionsQuery(enabled: boolean) {
  return useQuery({
    queryKey: subscriptionsKeys.mine,
    queryFn: () => apiClient.get<Subscription[]>("/api/subscriptions/"),
    enabled,
  });
}

// Dev-only bypass — the backend refuses this outright once TAP_SECRET_KEY is set, so
// this stops mattering the moment real payment is live (see orders/views.py's
// FreeSubscriptionActivateView).
export function useActivateFreeSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pricingTierId: string) =>
      apiClient.post<Subscription>("/api/subscriptions/activate-free/", { pricingTierId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionsKeys.mine });
    },
  });
}
