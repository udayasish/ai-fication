# AI Spend Audit

A free web app that audits your team's AI tool spend and tells you exactly where you're overpaying — like Mint, but for AI subscriptions.

Built as a 7-day internship assignment for Credex. Live at: [add deployed URL here]

---

## Screenshots

> Add 3 screenshots here after deploying:
> 1. Landing page
> 2. Audit form filled in
> 3. Results page with savings breakdown

---

## Quick Start

### Prerequisites
- Node.js 20+
- A Postgres database (we use Neon)
- API keys: Gemini, Resend, Upstash Redis

### Install and run locally

```bash
git clone https://github.com/your-username/ai-fication.git
cd ai-fication
npm install
```

Copy the environment variables:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
DATABASE_URL=              # Neon Postgres connection string
GEMINI_API_KEY=            # Google Generative AI API key
RESEND_API_KEY=            # Resend transactional email API key
NEXT_PUBLIC_APP_URL=       # http://localhost:3000 for local dev
UPSTASH_REDIS_REST_URL=    # Upstash Redis REST URL
UPSTASH_REDIS_REST_TOKEN=  # Upstash Redis REST token
```

Push the database schema:

```bash
npx drizzle-kit push
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

### Deploy

Push to GitHub and import the repo on [vercel.com](https://vercel.com). Set all environment variables in the Vercel dashboard. Set `NEXT_PUBLIC_APP_URL` to your live Vercel URL.

---

## Decisions

**1. Hardcoded audit rules instead of LLM for pricing logic**
Using an LLM to compare pricing would be non-deterministic, slow, and potentially wrong. The audit math is hardcoded rules against verified pricing data — fully testable, always accurate. The LLM (Gemini) is only used for the plain-English summary, where non-determinism is acceptable.

**2. Next.js App Router over a separate backend**
The product is a form → API → results page. Next.js API routes handle the backend cleanly without a separate server. Serverless functions on Vercel match the usage pattern perfectly — no idle costs.

**3. Neon Postgres over Firebase/Supabase**
Drizzle ORM with Neon gives full SQL control and type-safe queries without the abstraction overhead of Supabase's client SDK. The schema is simple enough that a raw SQL-adjacent layer is the right call.

**4. Upstash Redis for rate limiting over in-memory or Postgres**
Rate limiting needs per-IP counters with automatic expiry (TTL). Redis handles this natively — no cleanup jobs, no stale rows. Upstash's serverless Redis works perfectly with Vercel's edge environment.

**5. Human-readable slugs over random IDs**
Audit result URLs are meant to be shared on social media. `/audit/ai-audit-may-13-xK9mP2` is more trustworthy and shareable than `/audit/xK9mP2qR`. URL design is product design — a slug that looks like a tracking ID kills the viral loop.
