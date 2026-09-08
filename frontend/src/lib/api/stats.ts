import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Stat } from "@/types";

export const statsKeys = {
  all: ["stats"] as const,
};

export function useStatsQuery() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: () => apiClient.get<Stat[]>("/api/stats/"),
  });
}
