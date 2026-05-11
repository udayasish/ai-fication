import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { audits } from "@/db/schema";
import type { AuditResult } from "@/types/audit";

interface Props {
  params: Promise<{ slug: string }>;
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

      {/* ── Per-tool results ── */}
      <div className="flex flex-col gap-4">
        {results.map((r) => (
          <div
            key={r.toolId}
            className="bg-background border border-border rounded-xl p-5 flex flex-col gap-2"
          >
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

            <p className="text-sm text-muted-foreground">{r.reason}</p>

            <div className="flex gap-6 text-xs text-muted-foreground mt-1">
              <span>Current: <strong className="text-foreground">${r.currentSpend}/mo</strong></span>
              <span>Recommended: <strong className="text-foreground">{r.recommendedToolName} — {r.recommendedPlanName}</strong></span>
              <span>Projected: <strong className="text-foreground">${r.projectedSpend.toFixed(0)}/mo</strong></span>
            </div>

            {r.benchmarkSource && (
              <p className="text-xs text-muted-foreground">
                Benchmark: {r.benchmarkSource}
                {r.currentBenchmark !== undefined && ` — current score ${r.currentBenchmark}`}
                {r.recommendedBenchmark !== undefined && `, recommended score ${r.recommendedBenchmark}`}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
