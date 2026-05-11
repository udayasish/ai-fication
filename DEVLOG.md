# Development Log

## Delayed Start — Context

I was attending a family meeting on May 7th and 8th and didn't bring my laptop with me. Once I returned home on May 9th, I started working on the project immediately.

---

## Day 1 — 2026-05-09

**Hours worked:** 6

**What I did:**
Set up the complete project foundation and technical infrastructure.
Initialized Next.js 14 with TypeScript, configured Drizzle ORM with Neon PostgreSQL as the database backend, and defined the full schema with `audits` and `leads` tables.

- Pushed the schema to production database and verified connectivity.
- Researched current pricing for all 8 required AI tools (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf) and documented each in PRICING_DATA.md with official vendor URLs and verification dates.
- Created TypeScript type definitions and constants for all tools, plans, and alternative recommendations that the audit engine will use.
- Installed and configured shadcn/ui component library, set up Tailwind with custom theme variables
- Scaffolded the landing page architecture with Next.js route groups, implemented Header and Footer components.

**What I learned:**

- Earlier I used Prisma ORM. One of my senior from internship asked me to use Drizzle instead. There I learned that Drizzle is loaded faster in cold-start and NeonDb is more integrated with Drizzle.
- The pricing landscape for different AI tools.

**Blockers / what I'm stuck on:**
I am not stuck on anything particular today. But, I didnot use zod for validation till now, now I am thinking of use it in this project. So if that decesion can be consider as stucked, then I am stucked on that decision.

**Plan for tomorrow:**

- Build the complete Spend Input Form with all 8 AI tool rows. Each row needs dynamic plan selector, monthly spend input field with currency formatting, and seat count input that shows/hides based on whether the plan is seat-based.
- Implement full form validation with Zod schema.
- Form submission handler.
  I am two days behind. So I will try to work as much as I can tomorrow to make it even.

---

## Day 2 — 2026-05-10

**Hours worked:** 6

**What I did:**

Built the complete landing page and the audit form UI from scratch.

**Landing Page:**

- Designed and implemented a full dark teal color theme (`#0a1e1e` background, teal primary, emerald secondary, gold accent) using CSS variables in `globals.css` with Tailwind v4's `@theme inline` system — no `tailwind.config.ts` needed.
- Built 4 landing page sections as separate components: `HeroSection`, `HowItWorks`, `ToolsWeCover`, `CTASection` — each in `src/components/landing/`.
- Centralized all landing page texts (badge text, headings, subtext, CTA labels, steps, footer) into `src/lib/constants/landingPage.ts` — no hardcoded strings in any component.
- Styled `Header` with sticky positioning, logo on left, centered navbar with active state using `usePathname()`.
- Styled `Footer` to match header background with copyright and Credex attribution.
- Used alternating section backgrounds (`bg-background` / `bg-background2`) for visual depth separation between sections.

**Audit Page:**

- Built Zod validation schema in `src/lib/validators/audit.ts`.
- Built `ToolInput` component — one row per tool with checkbox, plan dropdown, monthly spend, and seat count. API tools (Anthropic API, OpenAI API, Gemini API) hide plan and seats automatically.
- Built full `SpendForm`, `handleToolChange`, column headers, and color-separated meta fields vs tool rows.
- Centralized column widths in `TOOL_ROW_COLS` constant so header and input columns stay in sync automatically.
- Styled audit page layout with a `bg-surface` card wrapping the form.

**What I learned:**

- Tailwind v4 uses `@theme inline` in CSS instead of `tailwind.config.ts` — CSS variables are the single source of truth for design tokens.

**Blockers / what I'm stuck on:**

- The API route (`/api/audit`) is not yet built — form submits but only logs to console.
- Results page (`/audit/[slug]`) not yet started.

**Plan for tomorrow:**

- Build `/api/audit` route — validate with Zod, run audit engine logic (compare spend vs alternatives), save to DB.
- Integrate Gemini API to generate a personalised savings summary.
- Build the results page (`/audit/[slug]`) to display savings recommendations.
- Wire form submission in `SpendForm` to POST to the API and redirect to results.

---

## Day 3 — 2026-05-11

**Hours worked:** 7

**What I did:**

Completed the full audit engine, wired the form to the backend, and got the entire flow working end-to-end.

**Audit Engine:**

- Realized that pure cost comparison was flawed — it would always recommend the cheapest tool regardless of quality. A tool like Claude costs more than ChatGPT, but it scores significantly higher on coding benchmarks. Always recommending the cheapest would produce misleading results.
- Designed a benchmark-based efficiency matrix: `efficiencyScore = benchmarkScore / monthlyCost`. This ranks tools by how much performance you get per dollar, not just by price.
- Added a 15-point quality threshold — if a recommended tool's benchmark drops more than 15 points vs the current tool, it gets discarded, even if it's more efficient on paper. This prevents recommending a significantly worse tool just because it's cheap.
- Sourced real benchmark scores for 5 use cases (coding, writing, research, data analysis, customer support) from SWE-bench Verified, MMLU-Pro, GPQA Diamond, and Chatbot Arena ELO. Documented all sources with URLs in `src/lib/constants/benchmarks.ts`.
- Rewrote `audit.service.ts` with 4 helper functions for separation of concerns: seat-based candidates, API token projection, best option picker, and pure cost fallback.

**Model Selector:**

- Discovered a critical accuracy bug: the token projection for API tools (Anthropic, OpenAI, Gemini) was always using the cheapest model as the baseline. If someone actually uses Claude Opus, the estimate would be 60x off.
- Added model dropdown for API tool rows in the form so users specify which model they actually use. The audit engine then uses that model's exact pricing for token volume estimation.
- Fixed a Zod validation bug in the process: `planId` refine was failing for included API tools (they have no plan). Moved the check to `superRefine` where tool category is accessible.

**API Route + Form Wiring:**

- Built `POST /api/audit`: Zod validation → `runAudit()` → Gemini summary (non-fatal if it fails) → DB insert with nanoid slug → returns `{ slug }`.
- The Gemini summary is the only place an LLM is used in the entire project. All audit math is deterministic hardcoded logic. Documented the full prompt in `PROMPTS.md` as required by the assignment.
- Wired `SpendForm` submit to call the API, added loading state and error handling, redirects to `/audit/[slug]` on success.
- Built a functional results page at `/audit/[slug]` — displays total savings, AI summary, and a card per tool with current vs projected spend, recommendation, and benchmark source.

**What I learned:**

- When building a recommendation engine, cheapest is not always best. You need a quality dimension alongside cost — otherwise you end up recommending tools that nobody would actually want to use.
- `&&` and `??` interact in a subtle way in TypeScript: `entry.modelId && find()` returns `"" | ApiModel` when modelId is an empty string, not `ApiModel | undefined`. A ternary is the correct fix.
- The assignment rewards knowing when _not_ to use AI — the examiner specifically checks this. Hardcoded deterministic logic for calculations, LLM only for the summary.

**Blockers / what I'm stuck on:**

- The results page is functional but unstyled — it shows all data correctly but looks plain.
- No field-level validation errors shown in the form yet (only top-level errors from Zod surface to the user).

**Plan for tomorrow:**

- Style the results page properly — savings hero section, benchmark comparison visualization, clear recommendation cards.
- Test the full flow end-to-end with real form inputs and verify DB records.
- Start on remaining required assignment files (README, ARCHITECTURE, REFLECTION, etc.).

---
