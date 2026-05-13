# PROMPTS.md — AI Prompt Documentation

This file documents every prompt sent to an external LLM in this project.
Required by the Credex assignment to demonstrate responsible, transparent AI use.

---

## Prompt 1 — Audit Summary

**Where used:** `src/app/api/audit/route.ts` → `buildGeminiPrompt()`

**Model:** `gemini-2.0-flash` (Google Generative AI)

**Purpose:**
Generate a short, personalised plain-English summary of the audit results for the
team that just completed the audit. This is the ONLY place an LLM is used in the
entire application. All audit math (efficiency scores, benchmark comparisons,
savings calculations) is done with hardcoded logic in `src/services/audit.service.ts`.

**When it is called:**
After `runAudit()` succeeds, before the DB insert. If Gemini fails, the request
still succeeds and `summary` is populated by `buildFallbackSummary()` — a templated
string built from the actual audit numbers. The summary is never blank.

**Prompt template:**

```
You are an AI spend advisor. A team of {teamSize} ran an AI tools audit.
Their primary use case: {useCase}.
Audit results:
- {toolName}: Save ${savings}/mo by switching to {recommendedToolName} {recommendedPlanName}
- {toolName}: Already on best value with {toolName}
... (one line per included tool)
Total projected savings: ${totalSavings}/month.

Write a 3–4 sentence personalised summary for this team. Be specific, direct, and encouraging.
Mention the biggest saving opportunity by name. Do not use bullet points.
Do not include generic advice — only speak to their actual results.
```

**Example rendered prompt (for a 10-person team, coding use case):**

```
You are an AI spend advisor. A team of 10 ran an AI tools audit.
Their primary use case: coding.
Audit results:
- Cursor: Already on best value with Cursor
- GitHub Copilot: Save $90/mo by switching to Windsurf Pro
- Anthropic API: Save $120/mo by switching to Gemini API Usage-based
Total projected savings: $210/month.

Write a 3–4 sentence personalised summary for this team. Be specific, direct, and encouraging.
Mention the biggest saving opportunity by name. Do not use bullet points.
Do not include generic advice — only speak to their actual results.
```

**Why Gemini and not GPT-4?**
The assignment asks for responsible, cost-conscious AI use. Gemini 2.0 Flash is
among the cheapest high-quality models available, which aligns with the product's
own message about AI cost efficiency.

**Why not use AI for the audit math itself?**
The assignment explicitly rewards knowing when NOT to use AI. Using an LLM for
pricing comparisons would be: slower, non-deterministic, and potentially wrong.
The hardcoded engine is faster, cheaper, fully testable, and always accurate.

---

## Fallback Summary — No LLM

**Where used:** `src/app/api/audit/route.ts` → `buildFallbackSummary()`

**Triggered when:** Gemini API fails (rate limit, network error, etc.)

**What it does:**
Generates a plain-English summary using only string interpolation from the audit
output — no external call. Covers two cases:

- **Savings found:** Names the top saving opportunity, states monthly + annual savings, mentions total tools optimised.
- **Already optimal:** Acknowledges the team is spending efficiently.

**Why a fallback and not just empty:**
A blank summary section looks broken to the user. The fallback gives a coherent
result even during API outages, keeping the product usable at all times.

---

*End of PROMPTS.md*
