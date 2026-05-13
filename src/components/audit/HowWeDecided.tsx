"use client";

import { useState } from "react";
import type { ComparisonStep } from "@/types/audit";

interface Props {
  steps?: ComparisonStep[];
}

export default function HowWeDecided({ steps }: Props) {
  const [open, setOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-col">
      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 hover:text-foreground transition-colors"
      >
        <span>How we decided</span>
        <span className="text-base leading-none">{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Collapsible steps ── */}
      {open && (
        <div className="flex flex-col gap-2 pt-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className={
                step.verdict === "selected"
                  ? "text-green-500 font-bold mt-px"
                  : "text-red-400 font-bold mt-px"
              }>
                {step.verdict === "selected" ? "✓" : "✗"}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground font-medium">
                  {step.toolName} — {step.planName} · ${step.projectedSpend.toFixed(0)}/mo · Score {step.benchmarkScore}
                </span>
                <span className="text-muted-foreground">{step.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
