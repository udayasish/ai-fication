import { TOOLS_MAP } from "@/lib/constants/tools";
import { TOOL_BENCHMARKS, BENCHMARK_SOURCES, BENCHMARK_QUALITY_THRESHOLD } from "@/lib/constants/benchmarks";
import type { BenchmarkUseCase } from "@/lib/constants/benchmarks";
import type { AuditFormValues } from "@/lib/validators/audit";
import type { AuditOutput, AuditResult } from "@/types/audit";
import type { Tool } from "@/types/tools";
import type { ToolEntry } from "@/types/audit";

// ── Internal type ─────────────────────────────────────────────────────────────

// Represents one cheaper option found during comparison.
// Used internally by helpers — never exposed outside this file.
interface CandidateOption {
  toolId: string;
  toolName: string;
  planName: string;
  projectedSpend: number;
  benchmark: number;
  benchmarkDrop: number;    // currentBenchmark − altBenchmark; 0 for same-tool plan
  efficiencyScore: number;  // benchmark / projectedSpend
  reason: string;
}

// ── Helper 1 — collectSeatOptions() ──────────────────────────────────────────

// Collects all cheaper options for a seat-based tool into one flat list.
// Option A: cheaper plans on the same tool (benchmarkDrop = 0, same quality)
// Option B: alternative tools that have a benchmark for the user's use case
// Returns unsorted — caller is responsible for sorting by efficiencyScore.
function collectSeatOptions(
  tool: Tool,
  entry: ToolEntry,
  currentBenchmark: number,
  useCase: BenchmarkUseCase,
  currentSpend: number
): CandidateOption[] {
  const options: CandidateOption[] = [];

  // 1. Option A — cheaper plan on the same tool (e.g. downgrade Business → Pro)
  //    Filter out free plans and the plan the user is already on, pick cheapest.
  const cheaperPlan = tool.plans
    .filter((p) => p.monthlyPricePerSeat > 0 && p.id !== entry.planId)
    .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];

  if (cheaperPlan) {
    const cost = cheaperPlan.monthlyPricePerSeat * entry.seats;
    // Only add if it actually costs less than what they pay now
    if (cost < currentSpend) {
      options.push({
        toolId: tool.id,
        toolName: tool.name,
        planName: cheaperPlan.name,
        projectedSpend: cost,
        benchmark: currentBenchmark,  // same tool = same benchmark score
        benchmarkDrop: 0,
        efficiencyScore: currentBenchmark / cost,
        reason: `Downgrade to ${tool.name} ${cheaperPlan.name} at $${cheaperPlan.monthlyPricePerSeat}/seat — same tool, lower cost`,
      });
    }
  }

  // 2. Option B — alternative tools
  for (const alt of tool.alternatives) {
    const altTool = TOOLS_MAP[alt.toolId];
    if (!altTool || altTool.plans.length === 0) continue;

    // Only consider alternatives that have a benchmark for the user's use case
    const altBenchmark = TOOL_BENCHMARKS[alt.toolId]?.[useCase];
    if (altBenchmark === undefined) continue;

    const cheapestPlan = altTool.plans
      .filter((p) => p.monthlyPricePerSeat > 0)
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];
    if (!cheapestPlan) continue;

    const cost = cheapestPlan.monthlyPricePerSeat * entry.seats;
    options.push({
      toolId: altTool.id,
      toolName: altTool.name,
      planName: cheapestPlan.name,
      projectedSpend: cost,
      benchmark: altBenchmark,
      benchmarkDrop: currentBenchmark - altBenchmark,
      efficiencyScore: altBenchmark / cost,
      reason: alt.reason,
    });
  }

  return options;
}

// ── Helper 2 — projectApiAlternatives() ──────────────────────────────────────

// Estimates the user's token volume from their current API spend, then projects
// what that same volume would cost on each alternative API tool.
// Returns unsorted — caller is responsible for sorting by efficiencyScore.
function projectApiAlternatives(
  tool: Tool,
  entry: ToolEntry,
  currentBenchmark: number,
  useCase: BenchmarkUseCase
): CandidateOption[] {
  const options: CandidateOption[] = [];

  if (!tool.apiModels || tool.apiModels.length === 0) return options;

  // 1. Use the user's selected model if provided, otherwise fall back to cheapest.
  //    Blended price = average of input and output price (assumes 50/50 token split).
  const cheapestModel = [...tool.apiModels].sort(
    (a, b) => a.inputPricePer1MTokens - b.inputPricePer1MTokens
  )[0];
  const currentModel =
    (entry.modelId ? tool.apiModels.find((m) => m.id === entry.modelId) : undefined)
    ?? cheapestModel;
  const currentBlended =
    (currentModel.inputPricePer1MTokens + currentModel.outputPricePer1MTokens) / 2;
  if (currentBlended === 0) return options;

  // 2. Estimate how many tokens they consume per month based on their actual spend
  const estimatedTokens = (entry.monthlySpend / currentBlended) * 1_000_000;

  // 3. For each alternative API tool, project cost for the same token volume
  for (const alt of tool.alternatives) {
    const altTool = TOOLS_MAP[alt.toolId];
    if (!altTool || !altTool.apiModels || altTool.apiModels.length === 0) continue;

    const altBenchmark = TOOL_BENCHMARKS[alt.toolId]?.[useCase];
    if (altBenchmark === undefined) continue;

    const altModel = [...altTool.apiModels].sort(
      (a, b) => a.inputPricePer1MTokens - b.inputPricePer1MTokens
    )[0];
    const altBlended =
      (altModel.inputPricePer1MTokens + altModel.outputPricePer1MTokens) / 2;
    if (altBlended === 0) continue;

    const projectedSpend = (estimatedTokens / 1_000_000) * altBlended;
    options.push({
      toolId: altTool.id,
      toolName: altTool.name,
      planName: "Usage-based",
      projectedSpend,
      benchmark: altBenchmark,
      benchmarkDrop: currentBenchmark - altBenchmark,
      efficiencyScore: altBenchmark / projectedSpend,
      reason: alt.reason,
    });
  }

  return options;
}

// ── Helper 3 — pickBestOption() ───────────────────────────────────────────────

// Sorts candidates by efficiencyScore descending, then walks the list and returns
// the first candidate whose benchmarkDrop is within the quality threshold.
// Returns null if every candidate is discarded — caller falls back to current tool.
function pickBestOption(candidates: CandidateOption[]): CandidateOption | null {
  const sorted = [...candidates].sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  return sorted.find((c) => c.benchmarkDrop <= BENCHMARK_QUALITY_THRESHOLD) ?? null;
}

// ── Helper 4 — pureCostFallback() ────────────────────────────────────────────

// Used when the current tool has no benchmark for the user's use case.
// Falls back to the original cost-only comparison: cheaper same-tool plan first,
// then cheapest alternative tool. No benchmark fields are populated.
function pureCostFallback(
  tool: Tool,
  entry: ToolEntry,
  currentSpend: number,
  useCase: string
): AuditResult {
  let bestSpend = currentSpend;
  let best: Omit<AuditResult, "currentSpend"> = {
    toolId: tool.id,
    toolName: tool.name,
    recommendedToolId: tool.id,
    recommendedToolName: tool.name,
    recommendedPlanName: "Current plan",
    projectedSpend: currentSpend,
    savings: 0,
    reason: "No benchmark available for this use case — showing cost comparison only",
    useCase,
  };

  // Check cheaper same-tool plan
  const cheaperPlan = tool.plans
    .filter((p) => p.monthlyPricePerSeat > 0 && p.id !== entry.planId)
    .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];

  if (cheaperPlan) {
    const cost = cheaperPlan.monthlyPricePerSeat * entry.seats;
    if (cost < bestSpend) {
      bestSpend = cost;
      best = {
        ...best,
        recommendedPlanName: cheaperPlan.name,
        projectedSpend: cost,
        savings: currentSpend - cost,
        reason: `Downgrade to ${tool.name} ${cheaperPlan.name} at $${cheaperPlan.monthlyPricePerSeat}/seat`,
      };
    }
  }

  // Check alternative tools by cost only
  for (const alt of tool.alternatives) {
    const altTool = TOOLS_MAP[alt.toolId];
    if (!altTool || altTool.plans.length === 0) continue;

    const cheapestPlan = altTool.plans
      .filter((p) => p.monthlyPricePerSeat > 0)
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];
    if (!cheapestPlan) continue;

    const cost = cheapestPlan.monthlyPricePerSeat * entry.seats;
    if (cost < bestSpend) {
      bestSpend = cost;
      best = {
        ...best,
        recommendedToolId: altTool.id,
        recommendedToolName: altTool.name,
        recommendedPlanName: cheapestPlan.name,
        projectedSpend: cost,
        savings: currentSpend - cost,
        reason: alt.reason,
      };
    }
  }

  return { ...best, currentSpend };
}

// ── Main export ───────────────────────────────────────────────────────────────

// Takes validated form data, runs the efficiency + benchmark algorithm for each
// included tool, and returns savings recommendations with full benchmark context.
export function runAudit(formData: AuditFormValues): AuditOutput {
  const includedTools = formData.tools.filter((t) => t.included);
  const useCase = formData.useCase as BenchmarkUseCase;

  const results: AuditResult[] = includedTools.map((entry) => {
    const tool = TOOLS_MAP[entry.toolId];
    const currentSpend = entry.monthlySpend;

    // 1. Look up benchmark for the current tool + use case
    const currentBenchmark = TOOL_BENCHMARKS[tool.id]?.[useCase];

    // 2. No benchmark available → fall back to pure cost comparison
    if (currentBenchmark === undefined) {
      return pureCostFallback(tool, entry, currentSpend, useCase);
    }

    const currentEfficiencyScore = currentBenchmark / currentSpend;
    const benchmarkMeta = BENCHMARK_SOURCES[useCase];

    // 3. Collect all candidate options using the appropriate helper
    const candidates =
      tool.category === "api"
        ? projectApiAlternatives(tool, entry, currentBenchmark, useCase)
        : collectSeatOptions(tool, entry, currentBenchmark, useCase, currentSpend);

    // 4. Walk sorted candidates — pick first that passes the quality threshold
    const best = pickBestOption(candidates);

    // 5. No candidate passed → current tool is already best value
    if (!best) {
      return {
        toolId: tool.id,
        toolName: tool.name,
        currentSpend,
        recommendedToolId: tool.id,
        recommendedToolName: tool.name,
        recommendedPlanName: "Current plan",
        projectedSpend: currentSpend,
        savings: 0,
        reason: "Already best value for your use case",
        useCase,
        currentBenchmark,
        recommendedBenchmark: currentBenchmark,
        benchmarkDrop: 0,
        currentEfficiencyScore,
        recommendedEfficiencyScore: currentEfficiencyScore,
        benchmarkSource: benchmarkMeta.name,
        benchmarkSourceUrl: benchmarkMeta.url,
      };
    }

    // 6. Candidate found — build the full result
    return {
      toolId: tool.id,
      toolName: tool.name,
      currentSpend,
      recommendedToolId: best.toolId,
      recommendedToolName: best.toolName,
      recommendedPlanName: best.planName,
      projectedSpend: best.projectedSpend,
      savings: currentSpend - best.projectedSpend,
      reason: best.reason,
      useCase,
      currentBenchmark,
      recommendedBenchmark: best.benchmark,
      benchmarkDrop: best.benchmarkDrop,
      currentEfficiencyScore,
      recommendedEfficiencyScore: best.efficiencyScore,
      benchmarkSource: benchmarkMeta.name,
      benchmarkSourceUrl: benchmarkMeta.url,
    };
  });

  // 7. Sum savings across all tools
  const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);

  return { results, totalSavings };
}
