import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { AdminOrder } from "@/types";

// Read-only in this phase — no edit/refund actions yet, see build-plan.md's Phase 14.3
// and progress-tracker.md's Known Gaps. Don't add a mutation here without also
// building the actual refund/edit logic it would need.
export const adminOrdersKeys = { all: ["admin-orders"] as const };

export function useAdminOrdersQuery() {
  return useQuery({
    queryKey: adminOrdersKeys.all,
    queryFn: () => apiClient.get<AdminOrder[]>("/api/admin/orders/"),
  });
}
