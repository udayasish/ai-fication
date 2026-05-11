# Audit Recommendation Algorithm

This document explains the logic behind the AI spend audit engine — how it decides
which tool to recommend, and why.

---

## Goal

Given what a team currently pays for an AI tool, find the best alternative that:

1. Delivers the most performance per dollar (efficiency)
2. Does not sacrifice quality beyond an acceptable threshold

The engine never blindly recommends the cheapest option. It balances cost savings
with benchmark-verified quality.

---

## Key Concepts

### Efficiency Score

```
efficiencyScore = benchmarkScore / monthlyCost
```

Higher efficiency = more benchmark performance per dollar spent.

**Example:**

- Tool A: benchmark 77, costs $100/month → efficiency = 0.77
- Tool B: benchmark 54, costs $50/month → efficiency = 1.08 ← better value

### Benchmark Score (0–100)

Each tool has a benchmark score per use case, sourced from public leaderboards:

| Use Case         | Benchmark Used                 | Source                        |
| ---------------- | ------------------------------ | ----------------------------- |
| Coding           | SWE-bench Verified (%)         | https://www.swebench.com      |
| Research         | MMLU-Pro (%)                   | https://artificialanalysis.ai |
| Data Analysis    | GPQA Diamond (%)               | https://artificialanalysis.ai |
| Writing          | Chatbot Arena ELO (normalized) | https://arena.ai/leaderboard  |
| Customer Support | Chatbot Arena ELO (normalized) | https://arena.ai/leaderboard  |

Tools with no benchmark for a given use case are excluded from comparison for that use case.

### Quality Threshold

```
BENCHMARK_QUALITY_THRESHOLD = 15 points
```

If an alternative's benchmark score is more than 15 points below the current tool's score,
it is discarded — regardless of how good its efficiency score is.

This prevents recommending a tool that is significantly weaker just because it is cheap.

---

## The Algorithm (Step by Step)

```
Input:  current tool, user's use case, all alternative tools
Output: best recommendation

1. Look up the current tool's benchmark score for the user's use case.
   If no benchmark exists for this use case → skip tool comparison, return current tool.

2. For each alternative tool:
   a. Look up its benchmark score for the user's use case.
      If no benchmark exists → skip this alternative.
   b. Calculate efficiencyScore = benchmarkScore / monthlyCost

3. Sort all alternatives by efficiencyScore descending (highest first).

4. Walk through the sorted alternatives one by one:
   a. Calculate benchmarkDrop = currentBenchmark - altBenchmark
   b. If benchmarkDrop > 15 → DISCARD this alternative, move to the next one
   c. If benchmarkDrop ≤ 15 → RECOMMEND this alternative, stop

5. If no alternative passed step 4 → RECOMMEND current tool ("Already best value")
```

---

## Worked Examples

### Example 1 — A cheaper alternative wins

**Setup:** User is on Cursor Pro, 5 seats, $100/month, use case: Coding

| Tool           | Benchmark | Monthly Cost | Efficiency | Benchmark Drop                      |
| -------------- | --------- | ------------ | ---------- | ----------------------------------- |
| GitHub Copilot | 46        | $50          | 0.92       | 66 − 46 = 20 → **discard**          |
| Claude         | 77        | $100         | 0.77       | 66 − 77 = −11 → **passes**          |
| Cursor (cur.)  | 66        | $100         | 0.66       | —                                   |
| Windsurf       | 55        | $100         | 0.55       | 66 − 55 = 11 → passes (not reached) |

**Walk-through:**

1. Copilot (highest efficiency 0.92) → drop = 20 > 15 → discard
2. Claude (next, efficiency 0.77) → drop = −11 (Claude is _better_) → passes → **Recommend Claude**

**Result:** Switch to Claude. Better benchmark (77 vs 66) at the same price.

---

### Example 2 — All alternatives fail the quality threshold

**Setup:** User is on Claude chat, 5 seats, $100/month, use case: Coding

| Tool           | Benchmark | Monthly Cost | Efficiency | Benchmark Drop             |
| -------------- | --------- | ------------ | ---------- | -------------------------- |
| GitHub Copilot | 46        | $50          | 0.92       | 77 − 46 = 31 → **discard** |
| Windsurf       | 55        | $100         | 0.55       | 77 − 55 = 22 → **discard** |
| Claude (cur.)  | 77        | $100         | 0.77       | —                          |

**Walk-through:**

1. Copilot → drop = 31 > 15 → discard
2. Windsurf → drop = 22 > 15 → discard
3. No alternatives left → **Recommend current tool**

**Result:** Claude is already the best value for coding. No switch recommended.

---

### Example 3 — API tools (token-based, no seat math)

API tools (Anthropic API, OpenAI API, Gemini API) charge per token, not per seat.
The user enters their actual monthly spend directly. The engine cannot project spend
on an alternative API without knowing the user's token volume.

**Solution:** Estimate token volume from current spend using the cheapest model's blended price:

```
blendedPrice       = (inputPricePer1MTokens + outputPricePer1MTokens) / 2
estimatedTokens    = (monthlySpend / blendedPrice) × 1,000,000
projectedSpend     = (estimatedTokens / 1,000,000) × altBlendedPrice
```

The same quality threshold (15 points) still applies.
The same efficiency-first walk-through still applies.

---

## Why Not Just Recommend the Cheapest Tool?

A pure cost optimizer would always recommend the cheapest option.
For a coding team, that might be GitHub Copilot at $10/seat — but Copilot scores
31 points lower than Claude on SWE-bench. That is not honest advice.

This algorithm ensures that every recommendation is:

- **Justified by data** (public benchmark scores with source URLs)
- **Balanced** (efficiency + quality, not just price)
- **Transparent** (the formula and sources are documented here and shown in the results UI)

---

## Constants Reference

| Constant                      | Value                             | File                              |
| ----------------------------- | --------------------------------- | --------------------------------- |
| `BENCHMARK_QUALITY_THRESHOLD` | 15                                | `src/lib/constants/benchmarks.ts` |
| `TOOL_BENCHMARKS`             | per tool/use case scores          | `src/lib/constants/benchmarks.ts` |
| `BENCHMARK_SOURCES`           | benchmark name + URL per use case | `src/lib/constants/benchmarks.ts` |

---

## Files Involved

| File                              | Role                                      |
| --------------------------------- | ----------------------------------------- |
| `src/lib/constants/benchmarks.ts` | Benchmark scores, sources, threshold      |
| `src/lib/constants/tools.ts`      | Tool definitions, plans, API model prices |
| `src/services/audit.service.ts`   | Algorithm implementation                  |
| `src/types/audit.ts`              | Input/output type definitions             |
