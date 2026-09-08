import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Order } from "@/types";

export const ordersKeys = {
  mine: ["orders", "mine"] as const,
};

export function useMyOrdersQuery(enabled: boolean) {
  return useQuery({
    queryKey: ordersKeys.mine,
    queryFn: () => apiClient.get<Order[]>("/api/orders/"),
    enabled,
  });
}

export type CreateOrderInput = { pricingTierId: string; tapToken: string };

// Throws (via apiClient's ApiError) on a declined/failed charge, same as every other
// mutation in this project — see client.ts's failureReason handling for why the
// error's .message is the actual decline reason, not a generic string.
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => apiClient.post<Order>("/api/orders/", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.mine });
    },
  });
}
