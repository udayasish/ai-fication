# Decision Log — Audit Recommendation Engine

This document traces every problem we identified, every question we asked, and every
decision we made while designing the recommendation algorithm. Written for interview
and examination purposes — to show the thinking process, not just the final answer.

---

## Starting Point — What We Had

The first version of the audit engine was a **pure cost optimizer**.

```
For each included tool:
  → find cheapest alternative
  → savings = currentSpend - cheapestAlternativeSpend
  → recommend cheapest alternative
```

It worked. But it had a fundamental flaw.

---

## Problem 1 — Solopreneur Edge Case

**Question raised:** A solo founder uses a seat-based tool alone. What if they leave
the seat count blank (defaults to 0)?

**The bug:**

```
projectedSpend = cheapestPlan.monthlyPricePerSeat × 0 = $0
savings        = $100 - $0 = $100  ← falsely shows full savings
```

**Solution:** Add a Zod validation refinement — if a tool is included and it is not an
API tool, seats must be ≥ 1.

**How we implemented it:** Used `.superRefine()` on the tools array in `AuditFormSchema`
(not on individual `ToolEntrySchema`) because only at the array level can we import
`TOOLS_MAP` and check each entry's tool category.

---

## Problem 2 — API Tools Have No Seat Math

**Question raised:** API tools (Anthropic API, OpenAI API, Gemini API) charge per token,
not per seat. The original engine returned `savings = 0` for all API tools — it just
couldn't calculate anything. That is a wasted recommendation opportunity.

**What we can do instead:** The user already tells us their monthly spend. If we know
the price per token of their current API model, we can back-calculate how many tokens
they consume. Then project what that same volume would cost on an alternative API.

**The formula:**

```
blendedPrice    = (inputPricePer1MTokens + outputPricePer1MTokens) / 2
estimatedTokens = (monthlySpend / blendedPrice) × 1,000,000
projectedSpend  = (estimatedTokens / 1,000,000) × altBlendedPrice
```

**What this required:**

- Adding `apiModels` with per-model token pricing to each API tool in `tools.ts`
- Letting the user select which model they use (model selector — planned, not yet built)

---

## Problem 3 — API Model List Was Outdated

**Question raised:** Anthropic alone has Haiku, Sonnet 4.5, Sonnet 4.6, Opus 4 — but
the original constants only had 3 models total across all 3 API tools.

**Decision:** Expand `apiModels` in `tools.ts` to include all currently relevant models
with accurate pricing sourced from official vendor pages.

**Updated model counts:**

- Anthropic API: 3 → 6 models (added Sonnet 4.5, Sonnet 4.6, Opus 4)
- OpenAI API: 2 → 5 models (added GPT-4.1 mini, GPT-4.1, o4-mini)
- Gemini API: 3 → 4 models (added Gemini 2.0 Flash, 2.5 Flash; removed outdated 1.5 Pro)

---

## Problem 4 — Cheapest Is Not Always Right

**Question raised:** If a coding team uses Claude, the engine would recommend switching
to GitHub Copilot (cheaper at $10/seat). But Claude scores significantly higher on
coding benchmarks. That is bad advice disguised as savings.

**Core insight:** A spend audit tool that recommends the cheapest option regardless of
quality will give wrong advice and lose user trust.

**The question then became:** How do we factor quality into the recommendation?

---

## Option Considered — Strengths-Based Filtering (Use Case Match)

**Idea:** Give each tool a `strengths` array. Only recommend alternatives that share
the user's use case.

```ts
{ id: "claude",  strengths: ["coding", "writing", "research"] }
{ id: "chatgpt", strengths: ["writing", "customer_support"]   }
```

**Why this helps:** ChatGPT would never be recommended to a coding team, because
`"coding"` is not in its strengths.

**Problem with this alone:** What if two tools both have `"coding"` in their strengths?
The engine still picks the cheaper one. We need a way to compare quality numerically.

---

## Option Considered — Quality Tiers

**Idea:** Label each tool as `"budget" | "standard" | "premium"`. Only compare within
the same tier. A premium Claude user would only be compared against other premium tools.

**Why we rejected it:** Tiers are subjective and hard to define fairly across vendors.
Two engineers would draw the tier lines differently. Not defensible.

---

## Decision — Benchmark Scores + Efficiency Matrix

**The right approach:** Use actual public benchmark scores to measure quality numerically.
Then compare tools on **performance per dollar** (efficiency score), not just price.

**Why this is better:**

- Grounded in real data, not opinion
- A single formula, transparent and explainable
- Handles all cases: cheaper + worse quality, same price + better quality, more expensive + much better quality

---

## Designing the Benchmark Score System

**Use case → benchmark mapping:**

| Use Case         | Benchmark          | Why this benchmark                                   |
| ---------------- | ------------------ | ---------------------------------------------------- |
| Coding           | SWE-bench Verified | Measures real GitHub issue solving, not toy problems |
| Research         | MMLU-Pro           | 57 academic subjects, knowledge breadth              |
| Data Analysis    | GPQA Diamond       | Graduate-level scientific reasoning                  |
| Writing          | Chatbot Arena ELO  | Human preference — the most honest writing measure   |
| Customer Support | Chatbot Arena ELO  | Conversational quality, same metric                  |

**Image/video generation:** Not applicable — none of our 8 tools are image/video gen tools.

**Scores are kept in a separate file (`benchmarks.ts`)** — not inside `tools.ts` — because
benchmark scores update every few months as new evals are published. Separation means
one file to update, not eight.

---

## The Efficiency Score Formula

```
efficiencyScore = benchmarkScore / monthlyCost
```

Higher = more benchmark performance per dollar.

**Example:**

- Claude: benchmark 77, $100/month → efficiency 0.77
- Copilot: benchmark 46, $50/month → efficiency 0.92 ← better value on pure math

---

## Problem 5 — Efficiency Alone Still Recommends Weak Tools

**The problem:** GitHub Copilot has efficiency 0.92 vs Claude's 0.77. Pure efficiency
says recommend Copilot. But Copilot's coding benchmark (46) is 31 points lower than
Claude's (77). A team losing 31 benchmark points is a serious quality drop.

**The question:** At what point is a benchmark drop too large to ignore?

**Solution:** 15-point threshold. Discard alternatives that drop more than 15 points.
Filters genuinely weak alternatives
while letting close ones through.

---
