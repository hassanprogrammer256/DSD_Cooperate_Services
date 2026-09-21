import { useState } from "react";

import Chip from "@mui/joy/Chip";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";

import { QueryState } from "@/components/common/QueryState";
import {
  useAdminServiceRequestsQuery,
  useServiceRequestStatsQuery,
  useUpdateServiceRequestStatusMutation,
} from "@/lib/api/serviceRequests";
import type { ServiceRequestStatus } from "@/types";

const STATUS_OPTIONS: { value: ServiceRequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_COLOR: Record<ServiceRequestStatus, "primary" | "warning" | "success" | "danger"> = {
  new: "primary",
  in_review: "warning",
  in_progress: "warning",
  completed: "success",
  rejected: "danger",
};

// Mirrors leads/LeadsListPage.tsx's shape exactly — status is the one write action
// this phase supports, not full field editing.
export function ServiceRequestsListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: requests, isLoading, isError, refetch } = useAdminServiceRequestsQuery({
    status: statusFilter || undefined,
  });
  const { data: stats } = useServiceRequestStatsQuery();
  const updateStatus = useUpdateServiceRequestStatusMutation();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Service Requests</h1>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
        {requests && requests.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3 font-mono text-text-primary">{request.reference}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {request.customerName}
                      <div className="text-xs text-text-muted">{request.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{request.serviceTitle}</td>
                    <td className="px-4 py-3">
                      <Select
                        size="sm"
                        value={request.status}
                        onChange={(_event, value) => {
                          if (value) updateStatus.mutate({ id: request.id, status: value as ServiceRequestStatus });
                        }}
                        renderValue={() => (
                          <Chip size="sm" color={STATUS_COLOR[request.status]} variant="soft">
                            {STATUS_OPTIONS.find((o) => o.value === request.status)?.label ?? request.status}
                          </Chip>
                        )}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(request.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center text-sm text-text-secondary">
            No service requests yet.
          </div>
        )}
      </QueryState>
    </div>
  );
}
