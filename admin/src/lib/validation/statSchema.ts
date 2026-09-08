import { z } from "zod";

export const statSchema = z.object({
  id: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  value: z.number().int(),
  suffix: z.string(),
  label: z.string().min(1, "Required"),
  order: z.number().int().min(0),
});

export type StatFormValues = z.infer<typeof statSchema>;
