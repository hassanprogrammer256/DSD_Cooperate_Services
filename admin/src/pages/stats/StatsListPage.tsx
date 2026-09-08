import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { statsApi } from "@/lib/api/content";
import type { Stat } from "@/types";

export function StatsListPage() {
  const { data, isLoading, isError, refetch } = statsApi.useList();
  const deleteMutation = statsApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<Stat | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Stats</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/stats/new")}>
          New Stat
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(s) => s.id}
          onEdit={(s) => void navigate(`/stats/${s.id}`)}
          onDelete={(s) => setPendingDelete(s)}
          columns={[
            { header: "Label", cell: (s) => s.label },
            { header: "Value", cell: (s) => `${s.value}${s.suffix}` },
            { header: "Order", cell: (s) => s.order },
          ]}
        />
      </QueryState>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        itemLabel={pendingDelete?.label ?? ""}
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteMutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
