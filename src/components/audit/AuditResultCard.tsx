import AlternativeOptions from "@/components/audit/AlternativeOptions";
import HowWeDecided from "@/components/audit/HowWeDecided";
import { dropColor } from "@/utils/dropColor";
import type { AuditResult } from "@/types/audit";

interface Props {
  result: AuditResult;
}

export default function AuditResultCard({ result: r }: Props) {
  const isOptimal = r.savings === 0;

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isOptimal
        ? "border-green-500/20 bg-background"
        : "border-border bg-background"
    }`}>

      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-semibold text-foreground text-base">{r.toolName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
        </div>
        {isOptimal ? (
          <span className="flex items-center gap-1.5 bg-green-500/10 text-green-500 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-500/20">
            ✓ Best value
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-green-500/10 text-green-500 text-sm font-bold px-3 py-1.5 rounded-full border border-green-500/20 whitespace-nowrap">
            💰 Save ${r.savings.toFixed(0)}/mo
          </span>
        )}
      </div>

      {/* ── Current vs Recommended ── */}
      {!isOptimal && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5">

          {/* Current */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current</p>
            <p className="text-sm font-semibold text-foreground">{r.toolName}</p>
            <span className="self-start bg-background2 border border-border rounded px-1.5 py-0.5 text-xs font-medium text-foreground">
              {r.currentPlanName}
            </span>
            <p className="text-xl font-bold text-red-400">${r.currentSpend.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            {r.currentBenchmark !== undefined && (
              <p className={`text-xs font-medium ${r.currentBenchmark >= 70 ? "text-green-500" : r.currentBenchmark >= 50 ? "text-yellow-500" : "text-red-400"}`}>
                Score {r.currentBenchmark}/100
              </p>
            )}
            {r.currentEfficiencyScore !== undefined && (
              <p className="text-xs text-muted-foreground">
                Efficiency {r.currentEfficiencyScore.toFixed(2)}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="text-primary text-xl font-bold">→</div>

          {/* Recommended */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended</p>
            <p className="text-sm font-semibold text-foreground">{r.recommendedToolName}</p>
            <span className="self-start bg-background2 border border-border rounded px-1.5 py-0.5 text-xs font-medium text-foreground">
              {r.recommendedPlanName}
            </span>
            <p className="text-xl font-bold text-green-500">${r.projectedSpend.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            {r.recommendedBenchmark !== undefined && (
              <p className={`text-xs font-medium ${r.recommendedBenchmark >= 70 ? "text-green-500" : r.recommendedBenchmark >= 50 ? "text-yellow-500" : "text-red-400"}`}>
                Score {r.recommendedBenchmark}/100
              </p>
            )}
            {r.recommendedEfficiencyScore !== undefined && (
              <p className="text-xs text-muted-foreground">
                Efficiency {r.recommendedEfficiencyScore.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Benchmark source + quality drop ── */}
      {r.benchmarkSource && !isOptimal && (
        <div className="flex items-center justify-between px-5 pb-4 text-xs text-muted-foreground">
          <span>Source: <a href={r.benchmarkSourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-foreground transition-colors">{r.benchmarkSource}</a></span>
          {r.benchmarkDrop !== undefined && (
            <span className={dropColor(r.benchmarkDrop)}>
              Quality: {r.benchmarkDrop <= 0 ? "+" : "−"}{Math.abs(r.benchmarkDrop)} pts
            </span>
          )}
        </div>
      )}

      {/* ── Collapsible sections ── */}
      {(r.alternatives && r.alternatives.length > 0) || (r.comparisonSteps && r.comparisonSteps.length > 0) ? (
        <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
          <AlternativeOptions alternatives={r.alternatives} />
          <HowWeDecided steps={r.comparisonSteps} />
        </div>
      ) : null}

    </div>
  );
}
