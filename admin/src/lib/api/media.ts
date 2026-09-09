import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

type UploadMediaResponse = { url: string };

// Backs any image embedded inside a JSONField (e.g. a Service.included item) that has
// no model FileField of its own to upload against — see backend/content/views.py's
// MediaUploadView and progress-tracker.md's 2026-09-09 entry (this replaces what used
// to be a raw data: URI typed/pasted into a plain text field).
export function useUploadMediaMutation() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.post<UploadMediaResponse>("/api/admin/media/upload/", formData);
    },
  });
}
