import { useState } from "react";

import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { ApiError } from "@/lib/api/client";
import { usersApi, useUserStatsQuery } from "@/lib/api/users";
import type { AdminUser } from "@/types";

export function UsersListPage() {
  const { data: users, isLoading, isError, refetch } = usersApi.useList();
  const { data: stats } = useUserStatsQuery();
  const deleteMutation = usersApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Users</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/users/new")}>
          New User
        </Button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-text-muted">Total</p>
            <p className="font-display text-lg font-bold text-text-primary">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-text-muted">Staff</p>
            <p className="font-display text-lg font-bold text-text-primary">{stats.staffCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-text-muted">New (7 days)</p>
            <p className="font-display text-lg font-bold text-text-primary">{stats.newLast7Days}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs text-text-muted">New (30 days)</p>
            <p className="font-display text-lg font-bold text-text-primary">{stats.newLast30Days}</p>
          </div>
        </div>
      )}

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={users ?? []}
          getRowKey={(u) => String(u.id)}
          onEdit={(u) => void navigate(`/users/${u.id}`)}
          onDelete={(u) => setPendingDelete(u)}
          emptyMessage="No users yet."
          columns={[
            { header: "Name", cell: (u) => u.name || "—" },
            { header: "Email", cell: (u) => u.email },
            { header: "Company", cell: (u) => u.company || "—" },
            { header: "Country", cell: (u) => u.country || "—" },
            {
              header: "Role",
              cell: (u) => (
                <Chip size="sm" color={u.isStaff ? "warning" : "neutral"} variant="soft">
                  {u.isStaff ? "Staff" : "Customer"}
                </Chip>
              ),
            },
            {
              header: "Joined",
              cell: (u) =>
                new Date(u.dateJoined).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            },
          ]}
        />
      </QueryState>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        itemLabel={pendingDelete?.email ?? ""}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteMutation.mutate(String(pendingDelete.id), {
            onSuccess: () => {
              toast.success("User deleted.");
              setPendingDelete(null);
            },
            onError: (err) => {
              console.error("[UsersListPage/onDelete]", err);
              toast.error(err instanceof ApiError ? err.message : "Couldn't delete this user.");
              setPendingDelete(null);
            },
          });
        }}
      />
    </div>
  );
}
