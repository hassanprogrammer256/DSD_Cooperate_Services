import { z } from "zod";

export const insightArticleSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  body: z.array(z.string()),
  publishDate: z.string().min(1, "Required"),
  touchesCompliance: z.boolean(),
  relatedInsightSlugs: z.array(z.string()),
  coverImage: z.instanceof(File).optional(),
});

export type InsightArticleFormValues = z.infer<typeof insightArticleSchema>;
