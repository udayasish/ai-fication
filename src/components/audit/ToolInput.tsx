import type { Tool } from "@/types/tools";
import type { ToolEntry } from "@/types/audit";
import { TOOL_ROW_COLS } from "@/lib/constants/auditPage";

interface ToolInputProps {
  tool: Tool;
  entry: ToolEntry;
  onChange: (updated: ToolEntry) => void;
}

const isApiTool = (tool: Tool) => tool.category === "api";

export default function ToolInput({ tool, entry, onChange }: ToolInputProps) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-surface rounded-xl border border-border transition-opacity ${!entry.included ? "opacity-50" : ""}`}>

      {/* ── Checkbox ── */}
      <input
        type="checkbox"
        checked={entry.included}
        onChange={() => onChange({ ...entry, included: !entry.included })}
        className="w-4 h-4 accent-primary cursor-pointer"
      />

      {/* ── Tool name ── */}
      <span className={`${TOOL_ROW_COLS.name} text-sm font-semibold text-foreground`}>{tool.name}</span>

      {/* ── Plan dropdown — hidden for API tools ── */}
      {!isApiTool(tool) && (
        <select
          value={entry.planId}
          disabled={!entry.included}
          onChange={(e) => onChange({ ...entry, planId: e.target.value })}
          className={`${TOOL_ROW_COLS.plan} w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed`}
        >
          <option value="">Select plan</option>
          {tool.plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} — ${plan.monthlyPricePerSeat}/seat
            </option>
          ))}
        </select>
      )}

      {/* ── Monthly spend ── */}
      <div className={`${TOOL_ROW_COLS.spend} flex items-center gap-1`}>
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

      {/* ── Seat count — hidden for API tools ── */}
      {!isApiTool(tool) && (
        <div className={`${TOOL_ROW_COLS.seats} flex items-center gap-1`}>
          <input
            type="number"
            min={0}
            value={entry.seats || ""}
            disabled={!entry.included}
            onChange={(e) => onChange({ ...entry, seats: Number(e.target.value) })}
            placeholder="seats"
            className="w-full h-10 text-sm bg-background border border-border rounded-md px-3 text-foreground disabled:cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}
