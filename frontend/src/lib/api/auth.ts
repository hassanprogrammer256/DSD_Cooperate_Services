import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { User } from "@/types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = { email: string; password: string; name: string; phone?: string };

// enabled: false — this query never fetches on its own. Its cache is populated
// imperatively by AuthContext (on bootstrap, login, register, logout) so every
// consumer reacts to the same value without a timing race between "is a session
// active" and "is this query enabled yet". See src/contexts/AuthContext.tsx.
export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => apiClient.get<User>("/api/auth/me/"),
    enabled: false,
    retry: false,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<{ access: string }>("/api/auth/login/", input),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiClient.post<{ access: string; user: User }>("/api/auth/register/", input),
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
