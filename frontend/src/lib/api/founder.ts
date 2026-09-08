import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Founder } from "@/types";

export const founderKeys = {
  all: ["founder"] as const,
};

export function useFounderQuery() {
  return useQuery({
    queryKey: founderKeys.all,
    queryFn: () => apiClient.get<Founder>("/api/founder/"),
  });
}
