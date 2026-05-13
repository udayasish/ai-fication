"use client";

import { useState } from "react";
import type { Tool } from "@/types/tools";
import type { ToolEntry } from "@/types/audit";
import { TOOL_ROW_COLS } from "@/lib/constants/auditPage";

interface ToolInputProps {
  tool: Tool;
  entry: ToolEntry;
  onChange: (updated: ToolEntry) => void;
  errors?: { spend?: string; seats?: string; planId?: string; modelId?: string };
}

const isApiTool = (tool: Tool) => tool.category === "api";

export default function ToolInput({ tool, entry, onChange, errors }: ToolInputProps) {
  const [seatError, setSeatError] = useState<string | null>(null);

  return (
    <div className={`flex items-start gap-4 p-4 bg-surface rounded-xl border border-border transition-opacity ${!entry.included ? "opacity-50" : ""}`}>

      {/* ── Checkbox ── */}
      <input
        type="checkbox"
        checked={entry.included}
        onChange={() => onChange({ ...entry, included: !entry.included })}
        className="w-4 h-4 accent-primary cursor-pointer mt-3"
      />

      {/* ── Tool name ── */}
      <span className={`${TOOL_ROW_COLS.name} text-sm font-semibold text-foreground mt-2`}>{tool.name}</span>

      {/* ── Plan dropdown — non-API tools only ── */}
      {!isApiTool(tool) && (
        <div className={`${TOOL_ROW_COLS.plan} flex flex-col gap-1`}>
          <select
            value={entry.planId}
            disabled={!entry.included}
            onChange={(e) => onChange({ ...entry, planId: e.target.value })}
            className="w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed"
          >
            <option value="">Select plan</option>
            {tool.plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — ${plan.monthlyPricePerSeat}/seat
              </option>
            ))}
          </select>
          {errors?.planId && (
            <p className="text-xs text-red-400">{errors.planId}</p>
          )}
        </div>
      )}

      {/* ── Model dropdown — API tools only ── */}
      {isApiTool(tool) && (
        <div className={`${TOOL_ROW_COLS.plan} flex flex-col gap-1`}>
          <select
            value={entry.modelId ?? ""}
            disabled={!entry.included}
            onChange={(e) => onChange({ ...entry, modelId: e.target.value })}
            className="w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed"
          >
            <option value="">Select model</option>
            {tool.apiModels?.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {errors?.modelId && (
            <p className="text-xs text-red-400">{errors.modelId}</p>
          )}
        </div>
      )}

      {/* ── Monthly spend ── */}
      <div className={`${TOOL_ROW_COLS.spend} flex flex-col gap-1`}>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">$</span>
          <input
            type="number"
            min={0}
            value={entry.monthlySpend || ""}
            disabled={!entry.included}
            onChange={(e) => onChange({ ...entry, monthlySpend: Number(e.target.value) })}
            placeholder="monthly"
            className="w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed"
          />
        </div>
        {errors?.spend && (
          <p className="text-xs text-red-400">{errors.spend}</p>
        )}
      </div>

      {/* ── Seat count — hidden for API tools ── */}
      {!isApiTool(tool) && (
        <div className={`${TOOL_ROW_COLS.seats} flex flex-col gap-1`}>
          <input
            type="number"
            min={0}
            value={entry.seats || ""}
            disabled={!entry.included}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSeatError(entry.included && val === 0 ? "At least 1 seat required" : null);
              onChange({ ...entry, seats: val });
            }}
            placeholder="seats"
            className="w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed"
          />
          {(seatError || errors?.seats) && (
            <p className="text-xs text-red-400">{seatError ?? errors?.seats}</p>
          )}
        </div>
      )}
    </div>
  );
}
