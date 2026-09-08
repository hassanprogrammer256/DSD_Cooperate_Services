import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { StaffUser } from "@/types";

export const authKeys = { me: ["auth", "me"] as const };

export type LoginInput = { email: string; password: string };

// enabled: false — populated imperatively from AuthContext (bootstrap/login/logout),
// same reasoning as the public site's useMeQuery: avoids a race between "is there a
// session" and "is this query allowed to fire yet."
export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => apiClient.get<StaffUser>("/api/auth/me/"),
    enabled: false,
    retry: false,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<{ access: string }>("/api/auth/login/", input),
  });
}

export function useRefreshMutation() {
  return useMutation({
    mutationFn: () => apiClient.post<{ access: string }>("/api/auth/refresh/"),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/auth/logout/"),
  });
}
