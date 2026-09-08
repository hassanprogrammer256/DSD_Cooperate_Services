import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { testimonialsApi } from "@/lib/api/content";
import type { Testimonial } from "@/types";

export function TestimonialsListPage() {
  const { data, isLoading, isError, refetch } = testimonialsApi.useList();
  const deleteMutation = testimonialsApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Testimonials</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/testimonials/new")}>
          New Testimonial
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(t) => t.id}
          onEdit={(t) => void navigate(`/testimonials/${t.id}`)}
          onDelete={(t) => setPendingDelete(t)}
          columns={[
            { header: "Name", cell: (t) => t.name },
            { header: "Role", cell: (t) => t.role },
            { header: "Quote", cell: (t) => `${t.quote.slice(0, 60)}${t.quote.length > 60 ? "…" : ""}` },
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
