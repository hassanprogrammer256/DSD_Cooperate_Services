import { z } from "zod";

export const teamMemberSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  bio: z.string().min(1, "Required"),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  linkedin: z.string(),
  photo: z.instanceof(File).optional(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;
