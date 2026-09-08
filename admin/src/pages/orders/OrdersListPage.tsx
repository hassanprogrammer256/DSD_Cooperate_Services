import Chip from "@mui/joy/Chip";

import { QueryState } from "@/components/common/QueryState";
import { useAdminOrdersQuery } from "@/lib/api/orders";
import type { OrderStatus } from "@/types";

const STATUS_COLOR: Record<OrderStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

// Read-only — no edit/refund actions in this phase. See build-plan.md's Phase 14.3
// and progress-tracker.md's Known Gaps; don't add an action here without also
// building the actual refund/edit logic it would need.
export function OrdersListPage() {
  const { data, isLoading, isError, refetch } = useAdminOrdersQuery();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Orders</h1>
      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Package</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary">
                      {order.customerName}
                      <div className="text-xs text-text-muted">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{order.tierName}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">
                      {order.currency} {order.amount}
                    </td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={STATUS_COLOR[order.status]} variant="soft">
                        {order.status}
                      </Chip>
                      {order.status === "failed" && order.failureReason && (
                        <div className="mt-1 text-xs text-text-muted">{order.failureReason}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center text-sm text-text-secondary">
            No orders yet.
          </div>
        )}
      </QueryState>
    </div>
  );
}
