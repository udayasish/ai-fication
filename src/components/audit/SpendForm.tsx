"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/constants/tools";
import { USE_CASE_OPTIONS, TOOL_ROW_COLS } from "@/lib/constants/auditPage";
import { AuditFormSchema } from "@/lib/validators/audit";
import type { AuditFormData, ToolEntry } from "@/types/audit";
import ToolInput from "@/components/audit/ToolInput";

interface FormErrors {
  teamSize?: string;
  useCase?: string;
  tools?: string;
  toolErrors?: Record<number, { spend?: string; seats?: string; planId?: string; modelId?: string }>;
}

const DEFAULT_FORM_DATA: AuditFormData = {
  teamSize: 0,
  useCase: "",
  tools: TOOLS.map((tool) => ({
    toolId: tool.id,
    planId: "",
    monthlySpend: 0,
    seats: 0,
    included: false,
    modelId: "",
  })),
};

const LS_KEY = "auditFormData";

export default function SpendForm() {
  const [formData, setFormData] = useState<AuditFormData>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM_DATA;
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? (JSON.parse(saved) as AuditFormData) : DEFAULT_FORM_DATA;
    } catch {
      return DEFAULT_FORM_DATA;
    }
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Persist form state to localStorage so it survives page refreshes
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(formData));
  }, [formData]);

  // Updates one tool entry in the tools array by matching toolId
  function handleToolChange(updated: ToolEntry) {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.toolId === updated.toolId ? updated : t)),
    }));
  }

  // Validates client-side with Zod, extracts per-field errors, then POSTs to /api/audit.
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrors({});

    // 1. Client-side Zod validation — show inline errors without hitting the API
    const parsed = AuditFormSchema.safeParse(formData);
    if (!parsed.success) {
      const flat   = parsed.error.flatten();
      const errors: FormErrors = {
        teamSize: flat.fieldErrors.teamSize?.[0],
        useCase:  flat.fieldErrors.useCase?.[0],
        tools:    flat.fieldErrors.tools?.[0],
      };
      // Extract per-tool errors from nested issue paths
      const toolErrors: NonNullable<FormErrors["toolErrors"]> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "tools" && typeof issue.path[1] === "number") {
          const idx   = issue.path[1];
          const field = issue.path[2] as string;
          if (!toolErrors[idx]) toolErrors[idx] = {};
          if (field === "monthlySpend") toolErrors[idx].spend   = issue.message;
          if (field === "seats")        toolErrors[idx].seats   = issue.message;
          if (field === "planId")       toolErrors[idx].planId  = issue.message;
          if (field === "modelId")      toolErrors[idx].modelId = issue.message;
        }
      }
      errors.toolErrors = toolErrors;
      setFormErrors(errors);
      return;
    }

    // 2. POST to API
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors({ tools: data.issues?.formErrors?.[0] ?? "Something went wrong. Please try again." });
        return;
      }

      router.push(`/audit/${data.slug}`);
      localStorage.removeItem(LS_KEY);
    } catch {
      setFormErrors({ tools: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* ── Meta fields ── */}
      <div className="bg-background rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="teamSize" className="text-sm font-medium text-foreground">
            Team size
          </label>
          <input
            id="teamSize"
            type="number"
            min={1}
            placeholder="e.g. 10"
            value={formData.teamSize || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, teamSize: Number(e.target.value) }))
            }
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          />
          {formErrors.teamSize && (
            <p className="text-xs text-red-400">{formErrors.teamSize}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="useCase" className="text-sm font-medium text-foreground">
            Primary use case
          </label>
          <select
            id="useCase"
            value={formData.useCase}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, useCase: e.target.value }))
            }
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          >
            <option value="">Select use case</option>
            {USE_CASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {formErrors.useCase && (
            <p className="text-xs text-red-400">{formErrors.useCase}</p>
          )}
        </div>
      </div>

      {/* ── Tool rows ── */}
      <div className="flex flex-col gap-3">
        {/* ── Column headers ── */}
        <div className="flex items-center gap-4 px-4">
          <div className={TOOL_ROW_COLS.checkbox} />
          <span className={`${TOOL_ROW_COLS.name} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>
            Tool
          </span>
          <span className={`${TOOL_ROW_COLS.plan} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>
            Plan / Model
          </span>
          <span className={`${TOOL_ROW_COLS.spend} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>
            Monthly Spend
          </span>
          <span className={`${TOOL_ROW_COLS.seats} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}>
            Seats
          </span>
        </div>

        {formErrors.tools && (
          <p className="text-xs text-red-400 px-4">{formErrors.tools}</p>
        )}

        <div className="bg-background2 rounded-xl p-4 flex flex-col gap-3">
          {formData.tools.map((entry, index) => {
            const tool = TOOLS.find((t) => t.id === entry.toolId)!;
            return (
              <ToolInput
                key={entry.toolId}
                tool={tool}
                entry={entry}
                onChange={handleToolChange}
                errors={formErrors.toolErrors?.[index]}
              />
            );
          })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Running audit…" : "Run My Audit →"}
      </button>
    </form>
  );
}
