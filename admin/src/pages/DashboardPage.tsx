import { CircleCheck, CircleX, Clock } from "lucide-react";

import { BarChart } from "@/components/common/BarChart";
import { QueryState } from "@/components/common/QueryState";
import { StatTile } from "@/components/common/StatTile";
import { useAdminOrdersQuery } from "@/lib/api/orders";
import { useLeadStatsQuery } from "@/lib/api/leads";

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

// First 5 slots of the /dataviz skill's validated default categorical palette —
// DSD's own tokens don't cover an 8-hue identity set, and these pass every CVD/
// contrast check out of the box (see references/palette.md), so used as-is here
// rather than hand-picking unvalidated colors for a true identity (nominal) chart.
const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];

export function DashboardPage() {
  const { data: leadStats, isLoading: leadsLoading, isError: leadsError, refetch: refetchLeads } = useLeadStatsQuery();
  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useAdminOrdersQuery();

  const ordersByStatus = { paid: 0, pending: 0, failed: 0 };
  orders?.forEach((order) => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Dashboard</h1>

      <QueryState
        isLoading={leadsLoading || ordersLoading}
        isError={leadsError || ordersError}
        onRetry={() => {
          void refetchLeads();
          void refetchOrders();
        }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total leads" value={leadStats?.total ?? 0} accent />
          <StatTile label="New leads" value={leadStats?.byStatus.new ?? 0} />
          <StatTile label="Total orders" value={orders?.length ?? 0} accent />
          <StatTile label="Paid orders" value={ordersByStatus.paid} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
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
      </QueryState>
    </div>
  );
}
