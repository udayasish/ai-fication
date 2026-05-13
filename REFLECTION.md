# REFLECTION.md

---

## Q1 — Hardest bug this week

> What was the hardest bug or technical problem you hit this week?
> Walk through: what was the symptom, what hypotheses did you form, what did you try, what finally worked?
> (150–400 words)

The hardest decision not bug I found while implementing this task is "How should we recommend the best AI tool based on the input form". I tried many mathematical equatiuon to finally reach a decision. So let me walk you through the decision making on that:

Started simple: find the cheapest tool that does the same job. If user pays $40 for Cursor Business and Cursor Pro is $20 → recommend
downgrade.

Problem hit: Here the algorithm always recommending the cheapest tool — what
if the cheaper tool is significantly worse?

First pivot: add quality scores

Introduced benchmark scores (SWE-bench, MMLU-Pro etc.) per tool. Now we're not just comparing cost — we're comparing value.

New problem: How do you combine cost and quality into one number to rank candidates? We need to calculate a matrix to get a score which have both the cost and benchmark factor.

Key insight: efficiency score

Decided on benchmark / cost as the efficiency score. Higher score = more quality per dollar.

Problem: A tool scoring 77 at $20 has efficiency 3.85. A tool scoring 40 at $5 has efficiency 8.0 — but nobody wants to recommend a terrible
tool just because it's cheap.

Second pivot: quality threshold gate

Added BENCHMARK_QUALITY_THRESHOLD = 15. If an alternative scores more than 15 points lower than the current tool — discard it, regardless of
efficiency score.

This prevents recommending a bad cheap tool over a good expensive one.

New problem: three-gate filtering

Now candidates had to pass 3 gates in order:

1. Efficiency must be better than current tool
2. If same cost → benchmark must be strictly higher
3. Benchmark drop must be within threshold

Final decision: sort by efficiency first, then apply all 3 gates.
Sort all candidates by efficiency descending → walk the list → first one that passes all 3 gates = recommendation. Rest become "alternatives"
shown on the results page.

Why this works: The highest-efficiency candidate that also passes quality is objectively the best switch.

Last problem: API tools are different

Seat-based tools have fixed monthly prices. API tools are usage-based — you can't compare "$3/1M tokens" to "$40/seat" directly.

Solution: Estimate token volume from current spend, then project what that same volume costs on each alternative API. Now the comparison is
apples-to-apples.

So to come to an decision of "how the audit run". These are tge thinking I went through.
I write the algorithm on an ALGORITHM.md file for you to check out.

---

## Q2 — A decision you reversed mid-week

> Describe a technical or product decision you made early in the week that you later changed.
> What made you reverse it? What did you learn from changing your mind?
> (150–400 words)

When I built the audit results page, I generated slugs using nanoid(8) — a random 8-character string. The URL looked like /audit/xK9mP2qR.
It worked technically — unique, collision-free, fast to generate. But the slug looked ugly. That can be flagged as 'negative' for the lead. I mean I wont paste that slug on any social media platform right. That looks ugly.

Reversal decision:
Changed slug generation to ai-audit-${month}-${day}-${nanoid(6)}. Same collision resistance, but now human-readable. The nanoid suffix is shorter (6 chars) since the date already provides natural uniqueness.

---

## Q3 — What you'd build in week 2

> If you had another week, what would you build next?
> Be specific — not just "more features" but exactly what, why, and in what order.
> (150–400 words)

1. PDF export of the audit result. Genuine lead can examine the audit result many times to finally make a decision.
2. I'd add more tools — Notion AI, Perplexity, Midjourney, ElevenLabs etc if we have discounted Credit service for them also.
3. Referral tracking: Right now, people can share their audit result link. But we don't know who shared it or how many new users came from that share. Referral tracking fixes this — we track which shared link brought which new user.

---

## Q4 — How you used AI tools

> Which AI tool(s) did you use? What tasks did you use them for?
> What did you NOT trust them with and why?
> Describe one specific moment where the AI was wrong and you caught it.
> (150–400 words)

I used Claude Code (Claude Sonnet 4.6) as my primary development assistant throughout the week. I used it for: scaffolding components, writing the Drizzle schema, setting up API routes, configuring the Resend singleton, writing the CI workflow, and generating all the documentation files (GTM, ECONOMICS, METRICS, LANDING_COPY, PRICING_DATA, PROMPTS).

---

## Q5 — Self-rating

> Rate yourself 1–10 on each dimension. One sentence reason for each rating.
> Be honest — a 6 with a real reason scores higher than a 9 with no reasoning.

**Discipline — 7/10**
Worked consistently across multiple days and completed all 6 MVP features within the week. Lost some time to back-and-forth on planning and design decisions instead of just building — a more disciplined approach would have locked decisions earlier and moved faster.

**Code quality — 7/10**
Followed clean separation of concerns throughout — services, constants, components, validators each in their right place — and used TypeScript consistently. Some edge cases in the audit engine were caught late rather than designed upfront, which meant going back to fix things that should have been right the first time.

**Design sense — 6/10**
The UI is clean and consistent with a dark teal theme that matches the product's identity. I first design the identity of the brand (assumption) and keep the theme consistant throughout.

**Problem-solving — 8/10**
The audit algorithm was the hardest part of the week. The naive cost comparison failed, so I designed the benchmark + efficiency score + quality threshold approach from scratch — each step forced by a specific problem the previous version couldn't handle. That kind of iterative reasoning felt like genuine problem-solving, not just implementation.

**Entrepreneurial thinking — 7/10**
Thought carefully about the viral loop, lead capture timing, share buttons, OG images, and Credex's business model throughout the build.
I always knew that building a product for the sake of building will never gain even 1% trust of the users. So I try to provide the best result for it. Best design in comfort of the user so that they will find it easier to use, view, share button at the right position, LEAD CTA on right position etc. I give enough thought on each and every decision that direct trigger any factor of an user.
