"use client";

import { useState } from "react";
import { TOOLS } from "@/lib/constants/tools";
import { USE_CASE_OPTIONS, TOOL_ROW_COLS } from "@/lib/constants/auditPage";
import type { AuditFormData, ToolEntry } from "@/types/audit";
import ToolInput from "@/components/audit/ToolInput";

export default function SpendForm() {
  const [formData, setFormData] = useState<AuditFormData>({
    teamSize: 0,
    useCase: "",
    tools: TOOLS.map((tool) => ({
      toolId: tool.id,
      planId: "",
      monthlySpend: 0,
      seats: 0,
      included: false,
    })),
  });

  // Updates one tool entry in the tools array by matching toolId
  function handleToolChange(updated: ToolEntry) {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => (t.toolId === updated.toolId ? updated : t)),
    }));
  }

  // Placeholder — API call comes in Step 6
  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted:", formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* ── Meta fields ── */}
      <div className="bg-background rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="teamSize"
            className="text-sm font-medium text-foreground"
          >
            Team size
          </label>
          <input
            id="teamSize"
            type="number"
            min={1}
            placeholder="e.g. 10"
            value={formData.teamSize || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                teamSize: Number(e.target.value),
              }))
            }
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="useCase"
            className="text-sm font-medium text-foreground"
          >
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
        </div>
      </div>

      {/* ── Tool rows ── */}
      <div className="flex flex-col gap-3">
        {/* <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Your AI Tools
        </p> */}

        {/* ── Column headers ── */}
        <div className="flex items-center gap-4 px-4">
          <div className={TOOL_ROW_COLS.checkbox} />
          <span
            className={`${TOOL_ROW_COLS.name}  text-xs font-semibold text-muted-foreground uppercase tracking-wider`}
          >
            Tool
          </span>
          <span
            className={`${TOOL_ROW_COLS.plan} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}
          >
            Plan
          </span>
          <span
            className={`${TOOL_ROW_COLS.spend} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}
          >
            Monthly Spend
          </span>
          <span
            className={`${TOOL_ROW_COLS.seats} text-xs font-semibold text-muted-foreground uppercase tracking-wider`}
          >
            Seats
          </span>
        </div>

        <div className="bg-background2 rounded-xl p-4 flex flex-col gap-3">
          {formData.tools.map((entry) => {
            const tool = TOOLS.find((t) => t.id === entry.toolId)!;
            return (
              <ToolInput
                key={entry.toolId}
                tool={tool}
                entry={entry}
                onChange={handleToolChange}
              />
            );
          })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity w-full"
      >
        Run My Audit →
      </button>
    </form>
  );
}
