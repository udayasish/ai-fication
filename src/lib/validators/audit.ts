import { z } from "zod";
import { TOOLS_MAP } from "@/lib/constants/tools";

const ToolEntrySchema = z
  .object({
    toolId: z.string().min(1),
    planId: z.string(),
    monthlySpend: z.number().min(0),
    seats: z.number().min(0),
    included: z.boolean(),
    modelId: z.string().optional(),
  })
  // planId check removed — moved to superRefine where we can check tool category
  .refine((entry) => !entry.included || entry.monthlySpend > 0, {
    message: "Enter a valid spend amount",
    path: ["monthlySpend"],
  });

export const AuditFormSchema = z.object({
  teamSize: z.number().int().positive("Team size must be at least 1"),
  useCase: z.string().min(1, "Please select a use case"),
  tools: z
    .array(ToolEntrySchema)
    .superRefine((tools, ctx) => {
      // Check 1 — at least one tool must be included
      if (!tools.some((t) => t.included)) {
        ctx.addIssue({
          code: "custom",
          message: "Please include at least one tool",
        });
      }

      tools.forEach((entry, index) => {
        if (!entry.included) return;
        const tool = TOOLS_MAP[entry.toolId];

        // Check 2 — non-API tools: seats ≥ 1
        if (tool && tool.category !== "api" && entry.seats < 1) {
          ctx.addIssue({
            code: "custom",
            message: "Enter at least 1 seat",
            path: [index, "seats"],
          });
        }

        // Check 3 — non-API tools: plan must be selected
        //   (moved here from ToolEntrySchema so we can check category)
        if (tool && tool.category !== "api" && !entry.planId) {
          ctx.addIssue({
            code: "custom",
            message: "Please select a plan",
            path: [index, "planId"],
          });
        }

        // Check 4 — API tools: model must be selected
        if (tool && tool.category === "api" && !entry.modelId) {
          ctx.addIssue({
            code: "custom",
            message: "Please select a model",
            path: [index, "modelId"],
          });
        }
      });
    }),
});

//when user give input , it will come via AuditFormData, but then it get validate using zod, and if everything is validated, inputs will be sent to the api with AuditFormValues.
export type AuditFormValues = z.infer<typeof AuditFormSchema>;
