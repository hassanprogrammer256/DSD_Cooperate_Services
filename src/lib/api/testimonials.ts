import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { Testimonial } from "@/types";

export const testimonialsKeys = {
  all: ["testimonials"] as const,
};

export function useTestimonialsQuery() {
  return useQuery({
    queryKey: testimonialsKeys.all,
    queryFn: () => apiClient.get<Testimonial[]>("/api/testimonials/"),
  });
}
