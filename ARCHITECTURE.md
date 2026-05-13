# ARCHITECTURE.md

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│                                                                  │
│   Landing Page (/)  →  Audit Form (/audit)                      │
│                              │                                   │
│                    POST /api/audit                               │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                       Next.js App                                │
│                    (Vercel Serverless)                           │
│                                                                  │
│   /api/audit          /api/leads          /api/og               │
│   route.ts            route.ts            route.tsx             │
│       │                   │                   │                  │
│   audit.service.ts    lead.service.ts     ImageResponse         │
│       │                   │               (next/og)             │
│   runAudit()          saveLead()                                │
│   (pure fn)           + resend.send()                           │
│       │                   │                                      │
└───────┼───────────────────┼──────────────────────────────────── ┘
        │                   │
┌───────▼───────────────────▼──────────────────────────────────── ┐
│                    External Services                             │
│                                                                  │
│   Neon Postgres      Resend Email      Gemini API               │
│   (audits + leads)   (report email)    (AI summary)             │
│                                                                  │
│   Upstash Redis                                                  │
│   (rate limiting)                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow — How user input becomes an audit result

```
1. User fills the audit form
   └─ Tool selections, plans, seats, monthly spend, team size, use case
   └─ Form state persisted to localStorage on every keystroke

2. User clicks "Run Audit"
   └─ Client POSTs to /api/audit

3. Route handler validates input
   └─ Zod schema checks all fields
   └─ Returns 400 if invalid

4. runAudit() runs (pure function, no I/O)
   └─ For each included tool:
       └─ Look up benchmark score for tool + use case
       └─ Collect all cheaper/alternative candidates
       └─ Score each candidate: benchmark / projected_spend
       └─ Apply 3 gates: efficiency > current, quality drop ≤ 15pts, same-cost only if higher benchmark
       └─ First passing candidate = recommendation
       └─ Rest = alternatives shown on results page
   └─ Sum savings across all tools → totalSavings

5. Gemini generates AI summary (non-fatal)
   └─ If Gemini fails → templated fallback summary used instead

6. Audit saved to Neon Postgres
   └─ id, slug, formData, results, totalSavings, summary

7. Client redirects to /audit/[slug]

8. Results page fetches audit from DB
   └─ Renders per-tool cards, savings hero, share buttons, lead form

9. User submits email (optional)
   └─ POST /api/leads
   └─ Upstash Redis rate limit check (5 req / 10 min per IP)
   └─ Lead saved to DB
   └─ Resend sends transactional email with report link
```

---

## Why this stack

**Next.js App Router**
The product is a form → API → results page — a perfect fit for Next.js. Server Components fetch DB data directly, Client Components handle interactivity. No separate backend needed. Vercel deploys it as serverless functions automatically.

**TypeScript**
The audit engine has complex types — tools, plans, benchmarks, results. TypeScript catches shape mismatches at compile time rather than at runtime in production. The codebase would be significantly harder to maintain without it.

**Drizzle ORM + Neon Postgres**
Drizzle gives type-safe queries with a SQL-adjacent API — no magic, no hidden N+1s. Neon is serverless Postgres that works natively with Vercel's serverless environment (connection pooling handled automatically).

**Gemini 2.0 Flash**
Cheapest high-quality model available. Aligns with the product's own message about AI cost efficiency. The summary is a nice-to-have — using an expensive model for it would be ironic.

**Resend**
Simple REST API for transactional email. 3,000 emails/month free. Takes 10 minutes to set up vs SES which requires domain verification, IAM roles, and bounce handling configuration.

**Upstash Redis**
Rate limiting needs per-IP counters with automatic TTL expiry. Redis handles this natively. Upstash is serverless Redis — no persistent server, pay per request, works with Vercel out of the box.

---

## What I'd change for 10,000 audits/day

**1. Cache benchmark data**
Currently `TOOL_BENCHMARKS` is imported fresh on every request. At high volume, wrap it in `unstable_cache()` so it's only read once per deployment.

**2. Queue the AI summary**
Currently Gemini runs synchronously in the POST /api/audit handler. At scale, move it to a background queue (Upstash QStash or Inngest) — the audit saves instantly, summary arrives seconds later via a webhook update.

**3. Add a read replica**
The results page hits the DB on every load. At 10k audits/day, add a Neon read replica and route GET queries there to take load off the primary.

**4. Move rate limiting to middleware**
Currently rate limiting runs inside the route handler. At scale, move it to Next.js middleware so it short-circuits before any JS executes — faster rejection, less compute used.

**5. Add connection pooling explicitly**
Neon handles pooling automatically at low scale, but at 10k/day we'd configure PgBouncer explicitly to cap concurrent DB connections and prevent connection exhaustion under traffic spikes.
