import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Founder } from "@/types";

// Singleton — GET/PATCH /api/founder/, no list/create/delete (see content/models.py's
// comment: "the admin app is what keeps this to one row").
export const founderKeys = { detail: ["admin-founder"] as const };

export function useFounderQuery() {
  return useQuery({
    queryKey: founderKeys.detail,
    queryFn: () => apiClient.get<Founder>("/api/founder/"),
  });
}

export function useUpdateFounderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) => apiClient.patch<Founder>("/api/founder/", data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: founderKeys.detail });
    },
  });
}
