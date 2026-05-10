import { z } from "zod";

const ToolEntrySchema = z
  .object({
    toolId: z.string().min(1),
    planId: z.string(),
    monthlySpend: z.number().min(0),
    seats: z.number().min(0),
    included: z.boolean(),
  })
  .refine((entry) => !entry.included || entry.planId.length > 0, {
    message: "Please select a plan",
    path: ["planId"],
  })
  .refine((entry) => !entry.included || entry.monthlySpend > 0, {
    message: "Enter a valid spend amount",
    path: ["monthlySpend"],
  });

export const AuditFormSchema = z.object({
  teamSize: z.number().int().positive("Team size must be at least 1"),
  useCase: z.string().min(1, "Please select a use case"),
  tools: z
    .array(ToolEntrySchema)
    .refine((tools) => tools.some((t) => t.included), {
      message: "Please include at least one tool",
    }),
});

//when user give input , it will come via AuditFormData, but then it get validate using zod, and if everything is validated, inputs will be sent to the api with AuditFormValues.
export type AuditFormValues = z.infer<typeof AuditFormSchema>;
