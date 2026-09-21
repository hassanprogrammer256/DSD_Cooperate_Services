import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { AdminSubscription, SubscriptionStats } from "@/types";

// Hand-written rather than createResourceHooks — the list needs a ?status= filter,
// same reasoning as leads.ts/serviceRequests.ts's own dedicated files.
export const subscriptionsKeys = {
  all: (filters?: { status?: string }) => ["admin-subscriptions", filters] as const,
  stats: ["admin-subscriptions-stats"] as const,
};

export function useAdminSubscriptionsQuery(filters: { status?: string } = {}) {
  return useQuery({
    queryKey: subscriptionsKeys.all(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      const query = params.toString();
      return apiClient.get<AdminSubscription[]>(`/api/admin/subscriptions/${query ? `?${query}` : ""}`);
    },
  });
}

export function useSubscriptionStatsQuery() {
  return useQuery({
    queryKey: subscriptionsKeys.stats,
    queryFn: () => apiClient.get<SubscriptionStats>("/api/admin/subscriptions/stats/"),
  });
}

function invalidateSubscriptions(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
  void queryClient.invalidateQueries({ queryKey: subscriptionsKeys.stats });
}

export function useCreateSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post<AdminSubscription>("/api/admin/subscriptions/", data),
    onSuccess: () => invalidateSubscriptions(queryClient),
  });
}

export function useUpdateSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      apiClient.patch<AdminSubscription>(`/api/admin/subscriptions/${id}/`, data),
    onSuccess: () => invalidateSubscriptions(queryClient),
  });
}

export function useDeleteSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete<void>(`/api/admin/subscriptions/${id}/`),
    onSuccess: () => invalidateSubscriptions(queryClient),
  });
}
