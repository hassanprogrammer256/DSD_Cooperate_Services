import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Notification } from "@/types";

export const notificationsKeys = {
  mine: ["notifications", "mine"] as const,
};

export function useNotificationsQuery(enabled: boolean) {
  return useQuery({
    queryKey: notificationsKeys.mine,
    queryFn: () => apiClient.get<Notification[]>("/api/notifications/"),
    enabled,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.patch<Notification>(`/api/notifications/${id}/`, { isRead: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.mine });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/notifications/mark-all-read/"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.mine });
    },
  });
}
