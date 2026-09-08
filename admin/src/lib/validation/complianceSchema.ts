import { z } from "zod";

export const complianceAreaSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  obligations: z.array(z.string()),
  notes: z.string(),
  sourceName: z.string(),
  relatedInsightSlugs: z.array(z.string()),
  heroImage: z.instanceof(File).optional(),
});

export type ComplianceAreaFormValues = z.infer<typeof complianceAreaSchema>;
