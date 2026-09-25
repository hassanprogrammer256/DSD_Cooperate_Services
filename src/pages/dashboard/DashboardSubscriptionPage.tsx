import Chip from "@mui/joy/Chip";

import { CtaButton } from "@/components/common/CtaButton";
import { QueryState } from "@/components/common/QueryState";
import { useAuth } from "@/contexts/AuthContext";
import { useMySubscriptionsQuery } from "@/lib/api/subscriptions";
import type { SubscriptionStatus } from "@/types";

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  active: "Active",
  expired: "Expired",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<SubscriptionStatus, "success" | "neutral" | "danger"> = {
  active: "success",
  expired: "neutral",
  cancelled: "danger",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function DashboardSubscriptionPage() {
  const { user } = useAuth();
  const { data: subscriptions, isLoading, isError, refetch } = useMySubscriptionsQuery(!!user);

  const active = subscriptions?.find((s) => s.status === "active");

  return (
    <div className="flex flex-col gap-6">
      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {active ? (
          <div className="rounded-xl border border-accent/30 bg-surface p-6">
            <span className="font-display text-sm font-extrabold capitalize tracking-wide text-accent">
              Current Plan
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-text-primary">{active.tierName}</h2>
              <Chip size="sm" color={STATUS_COLOR[active.status]} variant="soft">
                {STATUS_LABEL[active.status]}
              </Chip>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              Started {formatDate(active.startedAt)}
              {active.expiresAt && ` · Renews or expires ${formatDate(active.expiresAt)}`}
            </p>
            <div className="mt-6">
              <CtaButton to="/dashboard/services">Request a Service</CtaButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/30 bg-surface-secondary p-10 text-center">
            <p className="text-text-secondary">You don't have an active plan yet.</p>
            <CtaButton to="/pricing">View Pricing</CtaButton>
          </div>
        )}

        <h3 className="mt-10 font-display text-lg font-bold capitalize text-accent">Subscription History</h3>
        <div className="mt-4">
          {subscriptions && subscriptions.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-accent/30">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold">Started</th>
                    <th className="px-4 py-3 font-semibold">Expires</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-primary">{subscription.tierName}</td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(subscription.startedAt)}</td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(subscription.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <Chip size="sm" color={STATUS_COLOR[subscription.status]} variant="soft">
                          {STATUS_LABEL[subscription.status]}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No subscription history yet.</p>
          )}
        </div>
      </QueryState>
    </div>
  );
}
