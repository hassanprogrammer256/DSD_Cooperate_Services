import { useState } from "react";

import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { pricingApi } from "@/lib/api/content";
import type { PricingTier } from "@/types";

export function PricingListPage() {
  const { data, isLoading, isError, refetch } = pricingApi.useList();
  const deleteMutation = pricingApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<PricingTier | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Pricing Tiers</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/pricing/new")}>
          New Tier
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(p) => p.id}
          onEdit={(p) => void navigate(`/pricing/${p.id}`)}
          onDelete={(p) => setPendingDelete(p)}
          columns={[
            { header: "Name", cell: (p) => p.name },
            { header: "Price", cell: (p) => p.price },
            {
              header: "Purchasable",
              cell: (p) => (p.amount !== null ? <Chip color="success" size="sm">Yes</Chip> : <Chip color="neutral" size="sm">No</Chip>),
            },
            { header: "Highlighted", cell: (p) => (p.highlighted ? "Yes" : "") },
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
          deleteMutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
        }}
      />
    </div>
  );
}
