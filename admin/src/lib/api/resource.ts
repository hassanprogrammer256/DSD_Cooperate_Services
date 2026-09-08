import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

// One generic list/detail/create/update/delete hook set per content type, instead of
// hand-writing the same 5 mutations 7 times — see code-standards.md's React Query
// section (every mutation invalidates its list query key on success). `basePath` has
// no trailing slash (e.g. "/api/services"); `getId` extracts whichever field a given
// content type uses as its URL lookup value (`slug` for most, `id` for Testimonial/
// Stat/PricingTier — see each serializer's own id field).
export function createResourceHooks<T>(basePath: string, queryKeyName: string, getId: (item: T) => string) {
  const keys = {
    all: [queryKeyName] as const,
  };

  function useList() {
    return useQuery({
      queryKey: keys.all,
      queryFn: () => apiClient.get<T[]>(`${basePath}/`),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Record<string, unknown> | FormData) => apiClient.post<T>(`${basePath}/`, data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: keys.all });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> | FormData }) =>
        apiClient.patch<T>(`${basePath}/${id}/`, data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: keys.all });
      },
    });
  }

  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiClient.delete<void>(`${basePath}/${id}/`),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: keys.all });
      },
    });
  }

  return { keys, getId, useList, useCreate, useUpdate, useDelete };
}
