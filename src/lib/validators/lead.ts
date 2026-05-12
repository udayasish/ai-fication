import { z } from "zod";

export const LeadSchema = z.object({
  email:     z.string().email("Enter a valid email address"),
  company:   z.string().optional(),
  role:      z.string().optional(),
  auditSlug: z.string().min(1, "Audit slug is required"),
});

export type LeadValues = z.infer<typeof LeadSchema>;
