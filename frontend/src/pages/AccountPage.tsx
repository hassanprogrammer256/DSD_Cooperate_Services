import Chip from "@mui/joy/Chip";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import { CtaButton } from "@/components/common/CtaButton";
import { QueryState } from "@/components/common/QueryState";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrdersQuery } from "@/lib/api/orders";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { OrderStatus } from "@/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

const STATUS_COLOR: Record<OrderStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

export function AccountPage() {
  useDocumentTitle("My Account");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useMyOrdersQuery(!!user);

  async function handleLogout() {
    // flushSync forces the navigation to /home to actually commit — unmounting
    // ProtectedRoute — before logout() clears `user`. Without it, both this navigate
    // and ProtectedRoute's own reactive redirect-to-/login (fired when `user` goes
    // null) can still be in flight together, and the loser is non-deterministic.
    flushSync(() => {
      navigate("/");
    });
    await logout();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">My Account</h1>
          {user && <p className="mt-1 text-sm text-text-secondary">{user.email}</p>}
        </div>
        <button type="button" onClick={() => void handleLogout()} className="text-sm font-medium text-primary hover:opacity-80">
          Log Out
        </button>
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-text-primary">Order History</h2>

      <div className="mt-4">
        <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-primary">{order.tierName}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 font-mono text-text-secondary">
                        {order.currency} {order.amount}
                      </td>
                      <td className="px-4 py-3">
                        <Chip size="sm" color={STATUS_COLOR[order.status]} variant="soft">
                          {STATUS_LABEL[order.status]}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-secondary p-10 text-center">
              <p className="text-text-secondary">You haven't purchased an advisory package yet.</p>
              <CtaButton to="/pricing">View Pricing</CtaButton>
            </div>
          )}
        </QueryState>
      </div>
    </section>
  );
}
