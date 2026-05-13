# TESTS.md

## How to run

```bash
npm test
```

All tests use **Jest** with **ts-jest** for TypeScript support.

---

## Test file

**`src/services/audit.service.test.ts`**
Covers the core audit engine — the most critical business logic in the project.
All audit math is deterministic (no external calls, no DB, no API) so it is fully unit-testable.

---

## Tests

### Test 1 — Overspending plan recommends downgrade

**What it checks:** When a user is on a higher-tier plan than they need (Cursor Business at $40/seat with 1 seat), the engine recommends a cheaper plan and returns `savings > 0`.
**Why it matters:** This is the most common audit outcome — users on Business tiers who only need Pro.

---

### Test 2 — Already optimal returns zero savings

**What it checks:** When a user is already on the cheapest viable plan (GitHub Copilot Pro at $10/seat), the engine returns `savings = 0` and does not recommend switching.
**Why it matters:** The engine must not manufacture fake savings — honesty for already-optimal cases is a core product value.

---

### Test 3 — Total savings equals sum of individual savings

**What it checks:** With two tools included, `output.totalSavings` exactly equals the sum of `result.savings` across all results.
**Why it matters:** The hero number on the results page is `totalSavings` — any arithmetic error here directly misleads the user.

---

### Test 4 — Savings scale linearly with seat count

**What it checks:** Cursor Business at $40/seat × 5 seats = $200/mo current spend. The engine correctly calculates savings against the 5-seat projected spend, not a per-seat figure.
**Why it matters:** Teams are the primary user — multi-seat calculations must be correct.

---

### Test 5 — No included tools returns empty results

**What it checks:** When all tools have `included: false`, `output.results` is empty and `output.totalSavings` is `0`.
**Why it matters:** Edge case guard — the engine must not crash or return garbage on empty input.
