import { z } from "zod";

export const leadSchema = z.object({
  mainService: z.string().min(1, "Please select a service"),
  subService: z.string().optional(),
  name: z.string().min(2, "Please enter your full name"),
  mobile: z.string().min(6, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Please select your country of residence"),
  company: z.string().optional(),
  requirement: z.string().min(10, "Tell us a little about what you need"),
  preferredContactMethod: z.string().min(1, "Please select a preferred contact method"),
  preferredContactTime: z.string().optional(),
  consent: z.boolean().refine((value) => value === true, { message: "Please confirm before submitting" }),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
