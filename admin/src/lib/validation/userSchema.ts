import { z } from "zod";

// One shared shape for both create and edit — password is validated manually in
// UserFormPage's onSubmit (required + min-length only when creating) rather than via
// two parallel zod schemas, which made the react-hook-form generic type awkward for
// no real benefit.
export const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
  name: z.string().min(1, "Required"),
  phone: z.string(),
  company: z.string(),
  country: z.string(),
  isStaff: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
