import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import type { LeadFormValues } from "@/lib/validation/leadSchema";

type CreateLeadResponse = {
  reference: string;
};

function deviceType(): "mobile" | "desktop" {
  return window.innerWidth < 1024 ? "mobile" : "desktop";
}

export function useCreateLeadMutation() {
  return useMutation({
    mutationFn: (values: LeadFormValues & { attachment?: File | null }) => {
      const formData = new FormData();
      formData.append("mainService", values.mainService);
      if (values.subService) formData.append("subService", values.subService);
      formData.append("name", values.name);
      formData.append("mobile", values.mobile);
      formData.append("email", values.email);
      formData.append("country", values.country);
      if (values.company) formData.append("company", values.company);
      formData.append("requirement", values.requirement);
      formData.append("preferredContactMethod", values.preferredContactMethod);
      if (values.preferredContactTime) formData.append("preferredContactTime", values.preferredContactTime);
      formData.append("deviceType", deviceType());
      if (values.attachment) formData.append("attachment", values.attachment);

      return apiClient.post<CreateLeadResponse>("/api/leads/", formData);
    },
  });
}
