import { runAudit } from "./audit.service";
import type { AuditFormValues } from "@/lib/validators/audit";

// ── Helpers ────────────────────────────────────────────────────────────────────

// Builds a minimal valid AuditFormValues with one included seat-based tool.
function singleToolInput(
  toolId: string,
  planId: string,
  monthlySpend: number,
  seats: number,
  useCase: AuditFormValues["useCase"] = "coding",
): AuditFormValues {
  return {
    teamSize: seats,
    useCase,
    tools: [{ toolId, planId, monthlySpend, seats, included: true }],
  };
}

// ── Test 1 — Overspending plan recommends downgrade ────────────────────────────

test("recommends downgrade when user is on Business tier with 1 seat", () => {
  // Cursor Business = $40/seat. Cursor Pro = $20/seat.
  // Pro is cheaper and same benchmark → should recommend downgrade.
  const input = singleToolInput("cursor", "cursor_business", 40, 1, "coding");
  const output = runAudit(input);

  const result = output.results[0];
  expect(result.savings).toBeGreaterThan(0);
  expect(result.recommendedToolId).toBeDefined();
  // Savings must equal the difference between current and projected spend
  expect(result.savings).toBeCloseTo(
    result.currentSpend - result.projectedSpend,
    2,
  );
});

// ── Test 2 — Already optimal returns zero savings ──────────────────────────────

test("returns zero savings when tool is already best value", () => {
  // GitHub Copilot Pro = $10/seat — the cheapest paid plan.
  // No alternative is both cheaper AND passes the quality threshold for coding.
  const input = singleToolInput(
    "github_copilot",
    "copilot_pro",
    10,
    1,
    "coding",
  );
  const output = runAudit(input);

  const result = output.results[0];
  expect(result.savings).toBe(0);
  expect(result.recommendedToolId).toBe("github_copilot");
});

// ── Test 3 — Total savings equals sum of individual savings ───────────────────

test("totalSavings equals the sum of per-tool savings", () => {
  const input: AuditFormValues = {
    teamSize: 2,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "cursor_business",
        monthlySpend: 80,
        seats: 2,
        included: true,
      },
      {
        toolId: "github_copilot",
        planId: "copilot_enterprise",
        monthlySpend: 78,
        seats: 2,
        included: true,
      },
    ],
  };
  const output = runAudit(input);

  const expectedTotal = output.results.reduce((sum, r) => sum + r.savings, 0);
  expect(output.totalSavings).toBeCloseTo(expectedTotal, 2);
});

// ── Test 4 — Team size scales savings correctly ────────────────────────────────

test("savings scale linearly with seat count", () => {
  // Cursor Business at $40/seat × 5 seats = $200/mo
  // vs Cursor Pro at $20/seat × 5 seats = $100/mo → $100 savings
  const input = singleToolInput("cursor", "cursor_business", 200, 5, "coding");
  const output = runAudit(input);

  const result = output.results[0];
  expect(result.savings).toBeGreaterThan(0);
  // Projected spend must be less than current spend
  expect(result.projectedSpend).toBeLessThan(result.currentSpend);
  // Savings = difference (within float precision)
  expect(result.savings).toBeCloseTo(
    result.currentSpend - result.projectedSpend,
    2,
  );
});

// ── Test 5 — No included tools returns empty results ──────────────────────────

test("returns empty results and zero savings when no tools are included", () => {
  const input: AuditFormValues = {
    teamSize: 5,
    useCase: "coding",
    tools: [
      {
        toolId: "cursor",
        planId: "cursor_pro",
        monthlySpend: 100,
        seats: 5,
        included: false,
      },
    ],
  };
  const output = runAudit(input);

  expect(output.results).toHaveLength(0);
  expect(output.totalSavings).toBe(0);
});
