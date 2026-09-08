import { z } from "zod";

export const statEntrySchema = z.object({
  value: z.number().int(),
  suffix: z.string(),
  label: z.string(),
});

export const includedItemEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export const processStepEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const faqEntrySchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const serviceSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Required"),
  pillar: z.enum(["residency-solutions", "business-incorporation", "compliance-governance"]),
  icon: z.string().min(1, "Required — must match a key in src/lib/icons.ts's serviceIcons"),
  summary: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  included: z.array(includedItemEntrySchema),
  stats: z.array(statEntrySchema),
  process: z.array(processStepEntrySchema),
  faqs: z.array(faqEntrySchema),
  relatedInsightSlugs: z.array(z.string()),
  teamMemberSlugs: z.array(z.string()),
  heroImage: z.instanceof(File).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
