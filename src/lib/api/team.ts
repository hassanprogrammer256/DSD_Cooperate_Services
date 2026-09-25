import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { TeamMember } from "@/types";

export const teamKeys = {
  all: ["team"] as const,
  detail: (slug: string) => ["team", slug] as const,
};

export function useTeamQuery() {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: () => apiClient.get<TeamMember[]>("/api/team/"),
  });
}

export function useTeamMemberDetailQuery(slug: string) {
  return useQuery({
    queryKey: teamKeys.detail(slug),
    queryFn: () => apiClient.get<TeamMember>(`/api/team/${slug}/`),
  });
}
