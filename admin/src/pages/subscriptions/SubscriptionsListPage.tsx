import { useState } from "react";

import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { ApiError } from "@/lib/api/client";
import {
  useAdminSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useSubscriptionStatsQuery,
} from "@/lib/api/subscriptions";
import type { AdminSubscription, SubscriptionStatus } from "@/types";

const STATUS_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLOR: Record<SubscriptionStatus, "success" | "neutral" | "danger"> = {
  active: "success",
  expired: "neutral",
  cancelled: "danger",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function SubscriptionsListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: subscriptions, isLoading, isError, refetch } = useAdminSubscriptionsQuery({
    status: statusFilter || undefined,
  });
  const { data: stats } = useSubscriptionStatsQuery();
  const deleteMutation = useDeleteSubscriptionMutation();
  const [pendingDelete, setPendingDelete] = useState<AdminSubscription | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Subscriptions</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/subscriptions/new")}>
          New Subscription
        </Button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-text-muted">Total</p>
            <p className="font-display text-lg font-bold text-text-primary">{stats.total}</p>
          </div>
          {STATUS_OPTIONS.map((option) => (
            <div key={option.value} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-text-muted">{option.label}</p>
              <p className="font-display text-lg font-bold text-text-primary">{stats.byStatus[option.value] ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <Select
          placeholder="Filter by status"
          value={statusFilter || null}
          onChange={(_event, value) => setStatusFilter(value ?? "")}
          sx={{ minWidth: 180 }}
        >
          <Option value="">All statuses</Option>
          {STATUS_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={subscriptions ?? []}
          getRowKey={(s) => String(s.id)}
          onEdit={(s) => void navigate(`/subscriptions/${s.id}`)}
          onDelete={(s) => setPendingDelete(s)}
          emptyMessage="No subscriptions yet."
          columns={[
            {
              header: "Customer",
              cell: (s) => (
                <>
                  {s.customerName}
                  <div className="text-xs text-text-muted">{s.customerEmail}</div>
                </>
              ),
            },
            { header: "Plan", cell: (s) => s.tierName },
            { header: "Started", cell: (s) => formatDate(s.startedAt) },
            { header: "Expires", cell: (s) => formatDate(s.expiresAt) },
            {
              header: "Status",
              cell: (s) => (
                <Chip size="sm" color={STATUS_COLOR[s.status]} variant="soft">
                  {STATUS_OPTIONS.find((o) => o.value === s.status)?.label ?? s.status}
                </Chip>
              ),
            },
          ]}
        />
      </QueryState>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        itemLabel={pendingDelete ? `${pendingDelete.customerName}'s ${pendingDelete.tierName} subscription` : ""}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteMutation.mutate(pendingDelete.id, {
            onSuccess: () => {
              toast.success("Subscription deleted.");
              setPendingDelete(null);
            },
            onError: (err) => {
              console.error("[SubscriptionsListPage/onDelete]", err);
              toast.error(err instanceof ApiError ? err.message : "Couldn't delete this subscription.");
              setPendingDelete(null);
            },
          });
        }}
      />
    </div>
  );
}
