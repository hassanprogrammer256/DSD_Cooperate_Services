import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { ServiceRequest } from "@/types";

export const serviceRequestsKeys = {
  mine: ["service-requests", "mine"] as const,
};

export function useMyServiceRequestsQuery(enabled: boolean) {
  return useQuery({
    queryKey: serviceRequestsKeys.mine,
    queryFn: () => apiClient.get<ServiceRequest[]>("/api/service-requests/"),
    enabled,
  });
}

export type CreateServiceRequestInput = {
  service: string; // slug
  formData: Record<string, unknown>;
  attachment?: File | null;
};

// Multipart, matching leads.ts's pattern — formData is JSON-encoded into one field so
// it travels alongside the optional file (see backend/service_requests/serializers.py's
// binary=True JSONField, which expects exactly this shape).
export function useCreateServiceRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ service, formData, attachment }: CreateServiceRequestInput) => {
      const body = new FormData();
      body.append("service", service);
      body.append("formData", JSON.stringify(formData));
      if (attachment) body.append("attachment", attachment);
      return apiClient.post<ServiceRequest>("/api/service-requests/", body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: serviceRequestsKeys.mine });
    },
  });
}
