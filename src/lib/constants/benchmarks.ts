// Benchmark scores per tool per use case (0–100 scale).
// Kept in a separate file from tools.ts because scores update frequently
// (every few months as new evals are published) — one file to update, not eight.
//
// Sources:
//   SWE-bench Verified  → https://www.swebench.com/
//   MMLU-Pro            → https://artificialanalysis.ai/evaluations/mmlu-pro
//   GPQA Diamond        → https://artificialanalysis.ai/evaluations/gpqa-diamond
//   Chatbot Arena ELO   → https://arena.ai/leaderboard/text/
//
// Last verified: 2026-05

export type BenchmarkUseCase =
  | "coding"
  | "writing"
  | "research"
  | "data_analysis"
  | "customer_support";

export interface BenchmarkSource {
  name: string;
  // What the score actually measures — shown to users for transparency
  description: string;
  url: string;
}

// Documents which benchmark backs each use case score.
// Shown on the results page so users know exactly how we compare tools.
export const BENCHMARK_SOURCES: Record<BenchmarkUseCase, BenchmarkSource> = {
  coding: {
    name: "SWE-bench Verified",
    description: "% of real GitHub issues solved autonomously by the AI",
    url: "https://www.swebench.com/",
  },
  research: {
    name: "MMLU-Pro",
    description: "% accuracy across 57 academic knowledge subjects",
    url: "https://artificialanalysis.ai/evaluations/mmlu-pro",
  },
  data_analysis: {
    name: "GPQA Diamond",
    description: "% on graduate-level scientific reasoning questions",
    url: "https://artificialanalysis.ai/evaluations/gpqa-diamond",
  },
  writing: {
    name: "Chatbot Arena ELO (normalized)",
    description: "Human preference score from blind side-by-side comparisons, scaled 0–100",
    url: "https://arena.ai/leaderboard/text/",
  },
  customer_support: {
    name: "Chatbot Arena ELO (normalized)",
    description: "Human preference score from blind side-by-side comparisons, scaled 0–100",
    url: "https://arena.ai/leaderboard/text/",
  },
};

// If an alternative's benchmark drops more than this many points vs the current
// tool, it is discarded. The next highest efficiency alternative is checked instead.
// Only if ALL alternatives are discarded do we recommend the current tool.
export const BENCHMARK_QUALITY_THRESHOLD = 15;

// Scores per tool per use case.
// A missing key means "no benchmark exists for this tool + use case combination"
// — the audit engine skips that tool for that use case entirely.
//
// Scoring notes:
//   - coding:          SWE-bench Verified % (0–100), as of 2026-05
//   - research:        MMLU-Pro % (0–100)
//   - data_analysis:   GPQA Diamond % (0–100)
//   - writing:         Arena ELO normalized: (ELO − 1100) / 5, rounded
//   - customer_support: same Arena ELO normalization
//
//   Copilot and Windsurf have no official SWE-bench submission.
//   Scores marked [est.] are estimated from the underlying model they run on.
export const TOOL_BENCHMARKS: Record<string, Partial<Record<BenchmarkUseCase, number>>> = {

  // ── Coding assistants ────────────────────────────────────────────────────────

  cursor: {
    // Source: Cursor Background Agent with Claude Sonnet 4.6, swebench.com
    coding: 66,
  },

  github_copilot: {
    // [est.] Copilot runs on GPT-4o under the hood; no official SWE-bench submission
    coding: 46,
  },

  windsurf: {
    // [est.] Windsurf (now OpenAI-backed) uses GPT-4o / Codex; no official submission
    coding: 55,
  },

  // ── Chat AI ──────────────────────────────────────────────────────────────────

  claude: {
    // SWE-bench Verified: Claude Sonnet 4.5 official score (leanware.co/insights)
    coding: 77,
    // MMLU-Pro (artificialanalysis.ai)
    research: 89,
    // GPQA Diamond (leanware.co/insights)
    data_analysis: 83,
    // Arena ELO 1523 → (1523 − 1100) / 5 = 85 (arena.ai/leaderboard)
    writing: 85,
  },

  chatgpt: {
    // MMLU-Pro (artificialanalysis.ai)
    research: 87,
    // Arena ELO ~1314 → (1314 − 1100) / 5 = 43 — GPT-4o is no longer frontier
    writing: 43,
    // Arena ELO ~1314, strong conversational product
    customer_support: 75,
  },

  gemini: {
    // MMLU-Pro (artificialanalysis.ai)
    research: 90,
    // GPQA Diamond (leanware.co/insights, Gemini 2.5 Pro)
    data_analysis: 86,
    // Arena ELO ~1350 → (1350 − 1100) / 5 = 50
    writing: 50,
  },

  // ── API tools ────────────────────────────────────────────────────────────────
  // API tool scores mirror their chat counterpart — same underlying models,
  // same benchmark results.

  anthropic_api: {
    coding:        77,
    research:      89,
    data_analysis: 83,
    writing:       85,
  },

  openai_api: {
    // GPT-4.1 SWE-bench Verified (iternal.ai/llm-selection-guide)
    coding:           54,
    research:         87,
    customer_support: 75,
    writing:          43,
  },

  gemini_api: {
    research:      90,
    data_analysis: 86,
  },
};
