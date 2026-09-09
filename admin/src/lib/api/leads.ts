import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Lead, LeadStats, LeadStatus } from "@/types";

// Leads don't fit createResourceHooks' create/update/delete CRUD shape (no create from
// admin, one write action — status — not full field editing) — same reasoning as
// orders.ts's own dedicated file, see ui-registry.md.
export const leadsKeys = {
  all: (filters?: { status?: string; mainService?: string }) => ["admin-leads", filters] as const,
  stats: ["admin-leads-stats"] as const,
};

export function useAdminLeadsQuery(filters: { status?: string; mainService?: string } = {}) {
  return useQuery({
    queryKey: leadsKeys.all(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.mainService) params.set("mainService", filters.mainService);
      const query = params.toString();
      return apiClient.get<Lead[]>(`/api/admin/leads/${query ? `?${query}` : ""}`);
    },
  });
}

export function useLeadStatsQuery() {
  return useQuery({
    queryKey: leadsKeys.stats,
    queryFn: () => apiClient.get<LeadStats>("/api/admin/leads/stats/"),
  });
}

export function useUpdateLeadStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: LeadStatus }) =>
      apiClient.patch<Lead>(`/api/admin/leads/${id}/`, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      void queryClient.invalidateQueries({ queryKey: leadsKeys.stats });
    },
  });
}
