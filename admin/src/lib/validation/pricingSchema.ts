import { z } from "zod";

export const pricingTierSchema = z.object({
  id: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  price: z.string().min(1, "Required — the display string, e.g. \"AED 4,500\" or \"Custom\""),
  amount: z.string().nullable(),
  currency: z.string().min(1, "Required"),
  period: z.string(),
  features: z.array(z.string()),
  highlighted: z.boolean(),
  order: z.number().int().min(0),
});

export type PricingTierFormValues = z.infer<typeof pricingTierSchema>;
