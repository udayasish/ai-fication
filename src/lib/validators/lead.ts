import { z } from "zod";

export const LeadSchema = z.object({
  email:     z.string().email("Enter a valid email address"),
  company:   z.string().optional(),
  role:      z.string().optional(),
  teamSize:  z.coerce.number().int().min(1).optional(),
  auditSlug: z.string().min(1, "Audit slug is required"),
});

export type LeadValues = z.infer<typeof LeadSchema>;
