import { useState } from "react";

import Button from "@mui/joy/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { DataTable } from "@/components/common/DataTable";
import { QueryState } from "@/components/common/QueryState";
import { insightsApi } from "@/lib/api/content";
import type { InsightArticle } from "@/types";

export function InsightsListPage() {
  const { data, isLoading, isError, refetch } = insightsApi.useList();
  const deleteMutation = insightsApi.useDelete();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<InsightArticle | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">Insights</h1>
        <Button startDecorator={<Plus size={16} />} color="primary" onClick={() => void navigate("/insights/new")}>
          New Insight
        </Button>
      </div>

      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <DataTable
          rows={data ?? []}
          getRowKey={(i) => i.slug}
          onEdit={(i) => void navigate(`/insights/${i.slug}`)}
          onDelete={(i) => setPendingDelete(i)}
          columns={[
            { header: "Title", cell: (i) => i.title },
            { header: "Category", cell: (i) => i.category },
            { header: "Published", cell: (i) => i.publishDate },
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
