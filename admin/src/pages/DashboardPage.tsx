import { CircleCheck, CircleX, Clock } from "lucide-react";

import { BarChart } from "@/components/common/BarChart";
import { LineChart } from "@/components/common/LineChart";
import { Meter } from "@/components/common/Meter";
import { QueryState } from "@/components/common/QueryState";
import { StatTile } from "@/components/common/StatTile";
import { useAdminOrdersQuery } from "@/lib/api/orders";
import { useLeadStatsQuery } from "@/lib/api/leads";
import { useServiceRequestStatsQuery } from "@/lib/api/serviceRequests";
import { useSubscriptionStatsQuery } from "@/lib/api/subscriptions";
import { useUserStatsQuery } from "@/lib/api/users";

// Leads pipeline stages are ORDINAL (their order carries meaning — new leads move
// rightward through this list), so they share one hue in sequence rather than
// distinct categorical colors — see the /dataviz skill's color-formula.md: "swapping
// the order would change the meaning" is exactly the ordinal test. "Lost" breaks from
// the forward progression (it's a negative outcome, not a later pipeline stage), so it
// takes the fixed status-critical color instead — never impersonating a series.
const PIPELINE_STAGES: { key: string; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "documentation", label: "Documentation" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const SERVICE_LABELS: { key: string; label: string }[] = [
  { key: "incorporation", label: "Incorporation" },
  { key: "residency", label: "Residency" },
  { key: "compliance", label: "Compliance" },
  { key: "partner", label: "Partner with Us" },
  { key: "general", label: "General Enquiry" },
];

// Same ordinal reasoning as leads' pipeline — a request moves New -> In Review ->
// In Progress -> Completed; "Rejected" is the negative-outcome branch, so it gets the
// fixed status-critical color instead of the next sequential hue.
const SERVICE_REQUEST_STAGES: { key: string; label: string }[] = [
  { key: "new", label: "New" },
  { key: "in_review", label: "In Review" },
  { key: "in_progress", label: "In Progress" },
];

// First 5 slots of the /dataviz skill's validated default categorical palette —
// DSD's own tokens don't cover an 8-hue identity set  these pass every CVD/
// contrast check out of the box (see references/palette.md), so used as-is here
// rather than hand-picking unvalidated colors for a true identity (nominal) chart.
const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];

export function DashboardPage() {
  const { data: leadStats, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeadStatsQuery();
  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useAdminOrdersQuery();
  const {
    data: userStats,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useUserStatsQuery();
  const {
    data: subscriptionStats,
    isLoading: subscriptionsLoading,
    isError: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useSubscriptionStatsQuery();
  const {
    data: requestStats,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useServiceRequestStatsQuery();

  const ordersByStatus = { paid: 0, pending: 0, failed: 0 };
  orders?.forEach((order) => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;
  });

  const tierEntries = Object.entries(subscriptionStats?.activeByTier ?? {});

  const activeSubscriptionRate =
    userStats && userStats.total > 0 && subscriptionStats
      ? ((subscriptionStats.byStatus.active ?? 0) / userStats.total) * 100
      : 0;
  const leadCompletionRate =
    leadStats && leadStats.total > 0 ? ((leadStats.byStatus.completed ?? 0) / leadStats.total) * 100 : 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Dashboard</h1>

      <QueryState
        isLoading={leadsLoading || ordersLoading || usersLoading || subscriptionsLoading || requestsLoading}
        isError={leadsError || ordersError || usersError || subscriptionsError || requestsError}
        onRetry={() => {
          void refetchLeads();
          void refetchOrders();
          void refetchUsers();
          void refetchSubscriptions();
          void refetchRequests();
        }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total leads" value={leadStats?.total ?? 0} accent />
          <StatTile label="New leads" value={leadStats?.byStatus.new ?? 0} />
          <StatTile label="Total orders" value={orders?.length ?? 0} accent />
          <StatTile label="Paid orders" value={ordersByStatus.paid} />
        </div>

        {/* Users signed up */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total users" value={userStats?.total ?? 0} accent />
          <StatTile label="New users (7 days)" value={userStats?.newLast7Days ?? 0} />
          <StatTile label="New users (30 days)" value={userStats?.newLast30Days ?? 0} />
          <StatTile label="Staff accounts" value={userStats?.staffCount ?? 0} />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Signups, Last 7 Days</h2>
          <p className="mb-4 text-sm text-text-muted">New accounts registered each day this week. Hover for detail.</p>
          <LineChart
            data={(userStats?.signupsByDay ?? []).map((day) => ({
              label: new Date(day.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric" }),
              value: day.count,
            }))}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Meter
              label="Active Subscription Rate"
              value={activeSubscriptionRate}
              detail={`${subscriptionStats?.byStatus.active ?? 0} of ${userStats?.total ?? 0} registered users`}
            />
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <Meter
              label="Lead Completion Rate"
              value={leadCompletionRate}
              detail={`${leadStats?.byStatus.completed ?? 0} of ${leadStats?.total ?? 0} leads completed`}
            />
          </div>
        </div>

        {/* Subscriptions */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total subscriptions" value={subscriptionStats?.total ?? 0} accent />
          <StatTile label="Active subscriptions" value={subscriptionStats?.byStatus.active ?? 0} />
          <StatTile label="Expired subscriptions" value={subscriptionStats?.byStatus.expired ?? 0} />
          <StatTile label="Cancelled subscriptions" value={subscriptionStats?.byStatus.cancelled ?? 0} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Subscription Status</h2>
            <p className="mb-4 text-sm text-text-muted">
              Payment/lifecycle outcomes carry good/bad meaning, so this uses status colors, not identity colors.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CircleCheck size={18} className="text-success" />
                <span className="text-sm text-text-secondary">Active</span>
                <span className="font-display text-lg font-bold text-text-primary">
                  {subscriptionStats?.byStatus.active ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-warning" />
                <span className="text-sm text-text-secondary">Expired</span>
                <span className="font-display text-lg font-bold text-text-primary">
                  {subscriptionStats?.byStatus.expired ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CircleX size={18} className="text-error" />
                <span className="text-sm text-text-secondary">Cancelled</span>
                <span className="font-display text-lg font-bold text-text-primary">
                  {subscriptionStats?.byStatus.cancelled ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Active Subscriptions by Plan</h2>
            <p className="mb-4 text-sm text-text-muted">Each plan is a distinct identity, not a sequence.</p>
            {tierEntries.length > 0 ? (
              <BarChart
                data={tierEntries.map(([tierKey, count], index) => ({
                  label: tierKey.charAt(0).toUpperCase() + tierKey.slice(1),
                  value: count,
                  color: CATEGORICAL[index % CATEGORICAL.length],
                }))}
              />
            ) : (
              <p className="text-sm text-text-muted">No active subscriptions yet.</p>
            )}
          </div>
        </div>

        {/* Service requests */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Service Requests</h2>
            <p className="mb-4 text-sm text-text-muted">Where every open request currently sits.</p>
            <BarChart
              data={[
                ...SERVICE_REQUEST_STAGES.map((stage) => ({
                  label: stage.label,
                  value: requestStats?.byStatus[stage.key] ?? 0,
                  color: "var(--color-primary)",
                })),
                { label: "Completed", value: requestStats?.byStatus.completed ?? 0, color: "var(--color-success, #1e9e5a)" },
                { label: "Rejected", value: requestStats?.byStatus.rejected ?? 0, color: "var(--color-error, #d92d3d)" },
              ]}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Leads by Pipeline Stage</h2>
            <p className="mb-4 text-sm text-text-muted">Where every open enquiry currently sits.</p>
            <BarChart
              data={[
                ...PIPELINE_STAGES.map((stage) => ({
                  label: stage.label,
                  value: leadStats?.byStatus[stage.key] ?? 0,
                  color: "var(--color-primary)",
                })),
                { label: "Lost", value: leadStats?.byStatus.lost ?? 0, color: "var(--color-error, #d92d3d)" },
              ]}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Leads by Service</h2>
            <p className="mb-4 text-sm text-text-muted">Which pillar is generating the most enquiries.</p>
            <BarChart
              data={SERVICE_LABELS.map((service, index) => ({
                label: service.label,
                value: leadStats?.byService[service.key] ?? 0,
                color: CATEGORICAL[index % CATEGORICAL.length],
              }))}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 font-display text-base font-semibold text-text-primary">Orders by Status</h2>
            <p className="mb-4 text-sm text-text-muted">
              Payment outcomes carry good/bad meaning, so this uses status colors, not identity colors.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CircleCheck size={18} className="text-success" />
                <span className="text-sm text-text-secondary">Paid</span>
                <span className="font-display text-lg font-bold text-text-primary">{ordersByStatus.paid}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-warning" />
                <span className="text-sm text-text-secondary">Pending</span>
                <span className="font-display text-lg font-bold text-text-primary">{ordersByStatus.pending}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleX size={18} className="text-error" />
                <span className="text-sm text-text-secondary">Failed</span>
                <span className="font-display text-lg font-bold text-text-primary">{ordersByStatus.failed}</span>
              </div>
            </div>
          </div>
        </div>
      </QueryState>
    </div>
  );
}
