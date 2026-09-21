import Chip from "@mui/joy/Chip";
import { CheckCheck } from "lucide-react";

import { QueryState } from "@/components/common/QueryState";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/lib/api/notifications";

export function DashboardNotificationsPage() {
  const { user } = useAuth();
  const { data: notifications, isLoading, isError, refetch } = useNotificationsQuery(!!user);
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const hasUnread = notifications?.some((n) => !n.isRead) ?? false;

  return (
    <div className="rounded-xl border border-accent/30 bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg font-bold capitalize text-accent">Notifications</h2>
        {hasUnread && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="mt-6">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          {notifications && notifications.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start justify-between gap-4 rounded-lg border p-4 ${
                    notification.isRead ? "border-border bg-surface" : "border-accent/30 bg-accent-light"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{notification.title}</p>
                      {!notification.isRead && (
                        <Chip size="sm" color="danger" variant="soft">
                          New
                        </Chip>
                      )}
                    </div>
                    {notification.body && (
                      <p className="mt-1 text-sm text-text-secondary">{notification.body}</p>
                    )}
                    <p className="mt-2 text-xs text-text-muted">
                      {new Date(notification.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead.mutate(notification.id)}
                      className="shrink-0 text-xs font-medium text-primary hover:opacity-80"
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-accent/30 bg-surface-secondary p-10 text-center text-text-secondary">
              You don't have any notifications yet.
            </p>
          )}
        </QueryState>
      </div>
    </div>
  );
}
