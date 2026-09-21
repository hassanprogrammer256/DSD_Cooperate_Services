import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { apiClient, ApiError } from "@/lib/api/client";
import type { AdminServiceRequest, ServiceRequestStats, ServiceRequestStatus } from "@/types";

// Same shape as leads.ts — status is the one write action, not full field editing.
export const serviceRequestsKeys = {
  all: (filters?: { status?: string }) => ["admin-service-requests", filters] as const,
  stats: ["admin-service-requests-stats"] as const,
};

export function useAdminServiceRequestsQuery(filters: { status?: string } = {}) {
  return useQuery({
    queryKey: serviceRequestsKeys.all(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      const query = params.toString();
      return apiClient.get<AdminServiceRequest[]>(`/api/admin/service-requests/${query ? `?${query}` : ""}`);
    },
  });
}

export function useServiceRequestStatsQuery() {
  return useQuery({
    queryKey: serviceRequestsKeys.stats,
    queryFn: () => apiClient.get<ServiceRequestStats>("/api/admin/service-requests/stats/"),
  });
}

export function useUpdateServiceRequestStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ServiceRequestStatus }) =>
      apiClient.patch<AdminServiceRequest>(`/api/admin/service-requests/${id}/`, { status }),
    onSuccess: () => {
      toast.success("Service request status updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] });
      void queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.stats });
    },
    onError: (err) => {
      console.error("[useUpdateServiceRequestStatusMutation]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't update this request's status.");
    },
  });
}
