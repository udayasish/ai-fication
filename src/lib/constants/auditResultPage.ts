// Color classes applied to benchmark drop values on the audit result page.
// Green = recommended is as good or better, yellow = small drop, red = near threshold.
export const BENCHMARK_DROP_COLORS = {
  good: "text-green-500",
  warn: "text-yellow-500",
  bad:  "text-red-400",
} as const;

// Drops up to this many points are shown in yellow (warn).
// Drops above this are shown in red (bad).
export const BENCHMARK_DROP_WARN_THRESHOLD = 10;
