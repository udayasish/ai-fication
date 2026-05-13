# METRICS.md — Metrics Strategy

## North Star Metric

**Audits completed per week**

### Why this and not something else

- "Visitors" is a vanity metric — someone can land and immediately bounce
- "Leads captured" is downstream and skewed by the lead form design
- "Revenue" is too lagging for a week-1 product with a long sales cycle
- "Audits completed" measures real value delivered — a user gave us their data, ran the engine, and saw a result. That is the moment the product works.

Every other metric (leads, shares, consultations, revenue) is downstream of this one. If audits/week grows, everything else follows. If it stalls, everything stalls.

---

## 3 Input Metrics

### 1. Audit start rate (visitors → form submission started)

- Measures: is the landing page convincing enough to get someone to the form?
- Target: ≥ 50% of visitors start the form
- If low: fix the hero copy, add social proof, reduce friction above the fold

### 2. Audit completion rate (form started → results page reached)

- Measures: is the form too long, confusing, or broken?
- Target: ≥ 80% of starters complete
- If low: form has a confusing field, a validation error is blocking, or mobile UX is broken

### 3. Share rate (results page → share button clicked)

- Measures: is the result compelling enough to share?
- Target: ≥ 15% of results viewers share
- If low: savings numbers are too low (algorithm issue) or share UI is too buried

---

## What to instrument first

1. **Pageview on `/audit`** — are people reaching the form at all?
2. **Form submission event** — `POST /api/audit` 201 response count (already logged)
3. **Results page load** — `GET /audit/[slug]` count
4. **Lead capture submission** — `POST /api/leads` 201 response count
5. **Share button clicks** — add a simple `onClick` event to each share button

A free Plausible or Vercel Analytics setup captures 1–3 immediately. 4–5 need a single line of client-side tracking code per button.

---

## What number triggers a pivot decision

**If audit completion rate drops below 50% for 2 consecutive weeks:**
The form is the problem. Either shorten it (drop less-used tools), add progress indication, or move the most common tools to the top. This is the highest-leverage fix available.

**If share rate stays below 5% after 200 audits:**
The results page is not compelling. Either the savings numbers are too low (algorithm is too conservative), or the visual presentation isn't screenshot-worthy. Fix the UI before spending on distribution.

**If lead capture rate stays below 10% after 100 results views:**
The value proposition at the bottom of the results page isn't landing. Test: show the lead form inline between tool cards instead of at the bottom. Or gate one piece of insight (annual savings breakdown) behind the email.
