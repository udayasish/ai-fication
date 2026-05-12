// Represents one tool row in the form
export interface ToolEntry {
  toolId: string; // matches Tool.id from tools.ts
  planId: string; // matches SubscriptionPlan.id — empty string if no plan selected
  monthlySpend: number; // what the team currently pays per month
  seats: number; // number of seats — 0 for API/usage-based tools
  included: boolean; // whether this tool is included in the audit
  modelId?: string; // API tools only — which model they use (matches ApiModel.id)
}

// The full form data submitted by the user
export interface AuditFormData {
  teamSize: number;
  useCase: string;
  tools: ToolEntry[];
}

// One step in the algorithm's decision process — shown in the transparency section
export interface ComparisonStep {
  toolName: string;
  planName: string;
  projectedSpend: number;
  benchmarkScore: number;
  verdict: "selected" | "discarded_efficiency" | "discarded_quality" | "discarded_same_cost";
  reason: string;
}

// One runner-up recommendation shown below the primary pick
export interface AlternativeOption {
  toolName: string;
  planName: string;
  projectedSpend: number;
  savings: number;
  benchmarkScore: number;
  benchmarkDrop: number;
  efficiencyScore: number;
}

// One tool's savings analysis — output of the audit engine
export interface AuditResult {
  toolId: string;
  toolName: string;
  currentPlanName: string;
  currentSpend: number;
  recommendedToolId: string;
  recommendedToolName: string;
  recommendedPlanName: string;
  projectedSpend: number;
  savings: number;
  reason: string;

  // The use case this audit was run for — used to label results and look up benchmark source
  useCase: string;

  // Benchmark fields — undefined when no benchmark exists for this tool + use case.
  // In that case the engine falls back to pure cost comparison.
  currentBenchmark?: number;            // current tool's score (0–100)
  recommendedBenchmark?: number;        // recommended tool's score (0–100)
  benchmarkDrop?: number;               // currentBenchmark − recommendedBenchmark; negative = recommended is better
  currentEfficiencyScore?: number;      // currentBenchmark / currentSpend
  recommendedEfficiencyScore?: number;  // recommendedBenchmark / projectedSpend
  benchmarkSource?: string;             // e.g. "SWE-bench Verified"
  benchmarkSourceUrl?: string;          // verification URL shown on results page
  alternatives?: AlternativeOption[];   // ranked #2, #3, #4 by efficiency score
  comparisonSteps?: ComparisonStep[];   // every candidate considered + verdict
}

// Full output of the audit engine
export interface AuditOutput {
  results: AuditResult[];
  totalSavings: number;
}
