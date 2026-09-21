import { z } from "zod";

export const subscriptionSchema = z.object({
  userId: z.number({ error: "Please select a customer" }),
  tierId: z.string().min(1, "Please select a plan"),
  status: z.enum(["active", "expired", "cancelled"]),
  expiresAt: z.string(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
