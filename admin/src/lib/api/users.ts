import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { createResourceHooks } from "@/lib/api/resource";
import type { AdminUser, UserStats } from "@/types";

export const usersApi = createResourceHooks<AdminUser>("/api/admin/users", "admin-users", (u) => String(u.id));

export const usersKeys = {
  stats: ["admin-users-stats"] as const,
};

export function useUserStatsQuery() {
  return useQuery({
    queryKey: usersKeys.stats,
    queryFn: () => apiClient.get<UserStats>("/api/admin/users/stats/"),
  });
}

// A fresh random password, returned once — same "reset flow" shape as any other
// system's forced password reset. Not stored anywhere staff can read it again.
export function useResetUserPasswordMutation() {
  return useMutation({
    mutationFn: (id: number) => apiClient.post<{ newPassword: string }>(`/api/admin/users/${id}/reset-password/`),
  });
}
