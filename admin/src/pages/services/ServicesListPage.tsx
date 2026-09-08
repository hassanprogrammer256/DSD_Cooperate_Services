import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { servicesApi } from "@/lib/api/content";
import type { Service } from "@/types";

export function ServicesListPage() {
  const { data, isLoading, isError, refetch } = servicesApi.useList();
  const deleteMutation = servicesApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Services</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/services/new")}>
          New Service
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(s) => s.slug}
          onEdit={(s) => void navigate(`/services/${s.slug}`)}
          onDelete={(s) => setPendingDelete(s)}
          columns={[
            { header: "Title", cell: (s) => s.title },
            { header: "Pillar", cell: (s) => s.pillar },
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
