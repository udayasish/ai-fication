import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { audits } from "@/db/schema";
import type { AuditResult, AlternativeOption, ComparisonStep } from "@/types/audit";
import { BENCHMARK_DROP_COLORS, BENCHMARK_DROP_WARN_THRESHOLD } from "@/lib/constants/auditResultPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// Returns a color class based on how many benchmark points are lost vs current tool.
// Green = recommended is as good or better, yellow = small drop, red = near threshold.
function dropColor(drop: number): string {
  if (drop <= 0) return BENCHMARK_DROP_COLORS.good;
  if (drop <= BENCHMARK_DROP_WARN_THRESHOLD) return BENCHMARK_DROP_COLORS.warn;
  return BENCHMARK_DROP_COLORS.bad;
}

export default async function AuditResultPage({ params }: Props) {
  const { slug } = await params;

  // Fetch audit row by slug
  const audit = await db.query.audits.findFirst({
    where: eq(audits.slug, slug),
  });

  if (!audit) notFound();

  const results = audit.results as AuditResult[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Your Audit Results</h1>
        <p className="text-muted-foreground mt-1">
          Projected monthly savings:{" "}
          <span className="text-primary font-semibold">
            ${audit.totalSavings.toFixed(0)}
          </span>
        </p>
      </div>

      {/* ── AI Summary ── */}
      {audit.summary && (
        <div className="bg-background2 border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            AI Summary
          </p>
          <p className="text-foreground text-sm leading-relaxed">{audit.summary}</p>
        </div>
      )}

      {/* ── Per-tool result cards ── */}
      <div className="flex flex-col gap-4">
        {results.map((r) => (
          <div
            key={r.toolId}
            className="bg-background border border-border rounded-xl p-5 flex flex-col gap-4"
          >
            {/* ── Card header: tool name + savings badge ── */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{r.toolName}</span>
              {r.savings > 0 ? (
                <span className="text-green-500 font-semibold text-sm">
                  Save ${r.savings.toFixed(0)}/mo
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">Best value</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground -mt-2">{r.reason}</p>

            {/* ── Side-by-side comparison ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background2 rounded-lg p-4 flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current</p>
                <p className="text-sm font-medium text-foreground">{r.toolName}</p>
                <p className="text-xs text-muted-foreground">{r.currentPlanName}</p>
                <p className="text-xs text-muted-foreground">${r.currentSpend.toFixed(0)}/mo</p>
                {r.currentBenchmark !== undefined && (
                  <p className="text-xs text-muted-foreground">Benchmark: {r.currentBenchmark}/100</p>
                )}
                {r.currentEfficiencyScore !== undefined && (
                  <p className="text-xs text-muted-foreground">Efficiency: {r.currentEfficiencyScore.toFixed(2)}</p>
                )}
              </div>

              <div className="bg-background2 rounded-lg p-4 flex flex-col gap-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recommended</p>
                <p className="text-sm font-medium text-foreground">{r.recommendedToolName}</p>
                <p className="text-xs text-muted-foreground">{r.recommendedPlanName}</p>
                <p className="text-xs text-muted-foreground">${r.projectedSpend.toFixed(0)}/mo</p>
                {r.recommendedBenchmark !== undefined && (
                  <p className="text-xs text-muted-foreground">Benchmark: {r.recommendedBenchmark}/100</p>
                )}
                {r.recommendedEfficiencyScore !== undefined && (
                  <p className="text-xs text-muted-foreground">Efficiency: {r.recommendedEfficiencyScore.toFixed(2)}</p>
                )}
              </div>
            </div>

            {/* ── Benchmark source + quality drop ── */}
            {r.benchmarkSource && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Source: {r.benchmarkSource}</span>
                {r.benchmarkDrop !== undefined && (
                  <span className={dropColor(r.benchmarkDrop)}>
                    Quality drop: {r.benchmarkDrop <= 0 ? "+" : "−"}{Math.abs(r.benchmarkDrop)} pts
                  </span>
                )}
              </div>
            )}

            {/* ── Alternative options ── */}
            {r.alternatives && r.alternatives.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Other options</p>
                {r.alternatives.map((alt: AlternativeOption, i: number) => (
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
                      <span>Eff {alt.efficiencyScore.toFixed(2)}</span>
                      <span className={dropColor(alt.benchmarkDrop)}>
                        {alt.benchmarkDrop <= 0 ? "+" : "−"}{Math.abs(alt.benchmarkDrop)} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── How we decided ── */}
            {r.comparisonSteps && r.comparisonSteps.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  How we decided
                </p>
                {r.comparisonSteps.map((step: ComparisonStep, i: number) => (
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
        ))}
      </div>

    </div>
  );
}
