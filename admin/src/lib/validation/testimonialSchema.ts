import { z } from "zod";

export const testimonialSchema = z.object({
  quote: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  avatar: z.instanceof(File).optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
