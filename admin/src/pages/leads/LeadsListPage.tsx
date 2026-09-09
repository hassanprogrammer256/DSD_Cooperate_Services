import { useState } from "react";

import Chip from "@mui/joy/Chip";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";

import { QueryState } from "@/components/common/QueryState";
import { useAdminLeadsQuery, useLeadStatsQuery, useUpdateLeadStatusMutation } from "@/lib/api/leads";
import type { LeadStatus } from "@/types";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal / Quotation" },
  { value: "documentation", label: "Documentation" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost / Not Qualified" },
];

const STATUS_COLOR: Record<LeadStatus, "primary" | "success" | "warning" | "danger" | "neutral"> = {
  new: "primary",
  contacted: "neutral",
  qualified: "neutral",
  proposal: "warning",
  documentation: "warning",
  in_progress: "warning",
  completed: "success",
  lost: "danger",
};

const MAIN_SERVICE_LABELS: Record<string, string> = {
  incorporation: "Incorporation",
  residency: "Residency",
  compliance: "Compliance",
  partner: "Partner with Us",
  general: "General Enquiry",
};

// Basic lead-count stats only, short of the spec's full analytics/lead-source
// dashboard — a deliberate scope cut, see progress-tracker.md's 2026-09-09 entry.
// No edit/delete of a lead's own fields — status is the one write action this phase
// supports, matching the same "don't build what isn't wired up" discipline as the
// read-only Orders view.
export function LeadsListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");

  const { data: leads, isLoading, isError, refetch } = useAdminLeadsQuery({
    status: statusFilter || undefined,
    mainService: serviceFilter || undefined,
  });
  const { data: stats } = useLeadStatsQuery();
  const updateStatus = useUpdateLeadStatusMutation();

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Leads</h1>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
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

      <div className="mb-4 flex flex-wrap gap-3">
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
        <Select
          placeholder="Filter by service"
          value={serviceFilter || null}
          onChange={(_event, value) => setServiceFilter(value ?? "")}
          sx={{ minWidth: 180 }}
        >
          <Option value="">All services</Option>
          {Object.entries(MAIN_SERVICE_LABELS).map(([value, label]) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        {leads && leads.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3 font-mono text-text-primary">{lead.reference}</td>
                    <td className="px-4 py-3 text-text-primary">
                      {lead.name}
                      {lead.company && <div className="text-xs text-text-muted">{lead.company}</div>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {MAIN_SERVICE_LABELS[lead.mainService] ?? lead.mainService}
                      {lead.subService && <div className="text-xs text-text-muted">{lead.subService}</div>}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      <div>{lead.mobile}</div>
                      <div className="text-xs text-text-muted">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        size="sm"
                        value={lead.status}
                        onChange={(_event, value) => {
                          if (value) updateStatus.mutate({ id: lead.id, status: value as LeadStatus });
                        }}
                        renderValue={() => (
                          <Chip size="sm" color={STATUS_COLOR[lead.status]} variant="soft">
                            {STATUS_OPTIONS.find((o) => o.value === lead.status)?.label ?? lead.status}
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
                      {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface-secondary p-8 text-center text-sm text-text-secondary">
            No leads yet.
          </div>
        )}
      </QueryState>
    </div>
  );
}
