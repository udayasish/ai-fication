"use client";

import { useState } from "react";
import { dropColor } from "@/utils/dropColor";
import type { AlternativeOption } from "@/types/audit";

interface Props {
  alternatives?: AlternativeOption[];
}

export default function AlternativeOptions({ alternatives }: Props) {
  const [open, setOpen] = useState(false);

  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="flex flex-col">
      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 hover:text-foreground transition-colors"
      >
        <span>Other options ({alternatives.length})</span>
        <span className="text-base leading-none">{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Collapsible list ── */}
      {open && (
        <div className="flex flex-col gap-2 pt-1">
          {alternatives.map((alt, i) => (
            <div
              key={`${alt.toolName}-${alt.planName}`}
              className="flex items-center justify-between text-xs bg-background2 rounded-md px-3 py-2"
            >
              <span className="text-foreground font-medium">
                #{i + 2} {alt.toolName} — {alt.planName}
              </span>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>${alt.projectedSpend.toFixed(0)}/mo</span>
                <span>Score {alt.benchmarkScore}</span>
                <span className={dropColor(alt.benchmarkDrop)}>
                  {alt.benchmarkDrop <= 0 ? "+" : "−"}{Math.abs(alt.benchmarkDrop)} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
