import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { complianceApi } from "@/lib/api/content";
import type { ComplianceArea } from "@/types";

export function ComplianceListPage() {
  const { data, isLoading, isError, refetch } = complianceApi.useList();
  const deleteMutation = complianceApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<ComplianceArea | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Compliance Areas</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/compliance/new")}>
          New Compliance Area
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(c) => c.slug}
          onEdit={(c) => void navigate(`/compliance/${c.slug}`)}
          onDelete={(c) => setPendingDelete(c)}
          columns={[
            { header: "Title", cell: (c) => c.title },
            { header: "Source", cell: (c) => c.sourceName },
          ]}
        />
      </QueryState>

      <ConfirmDeleteModal
        open={!!pendingDelete}
        itemLabel={pendingDelete?.title ?? ""}
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
