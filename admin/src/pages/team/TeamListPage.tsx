import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { teamApi } from "@/lib/api/content";
import type { TeamMember } from "@/types";

export function TeamListPage() {
  const { data, isLoading, isError, refetch } = teamApi.useList();
  const deleteMutation = teamApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<TeamMember | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Team</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/team/new")}>
          New Team Member
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(t) => t.slug}
          onEdit={(t) => void navigate(`/team/${t.slug}`)}
          onDelete={(t) => setPendingDelete(t)}
          columns={[
            { header: "Name", cell: (t) => t.name },
            { header: "Role", cell: (t) => t.role },
            { header: "Email", cell: (t) => t.email },
          ]}
        />
      </QueryState>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        itemLabel={pendingDelete?.name ?? ""}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteMutation.mutate(pendingDelete.slug, { onSuccess: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
