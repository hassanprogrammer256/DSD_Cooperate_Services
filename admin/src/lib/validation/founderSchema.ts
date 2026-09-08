import { z } from "zod";

export const founderSchema = z.object({
  name: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  bio: z.string().min(1, "Required"),
  email: z.string(),
  linkedin: z.string(),
  photo: z.instanceof(File).optional(),
});

export type FounderFormValues = z.infer<typeof founderSchema>;
