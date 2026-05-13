import { BENCHMARK_DROP_COLORS, BENCHMARK_DROP_WARN_THRESHOLD } from "@/lib/constants/auditResultPage";

// Returns a Tailwind color class based on benchmark points lost vs current tool.
// Green = no drop or improvement, yellow = small drop, red = near threshold.
export function dropColor(drop: number): string {
  if (drop <= 0) return BENCHMARK_DROP_COLORS.good;
  if (drop <= BENCHMARK_DROP_WARN_THRESHOLD) return BENCHMARK_DROP_COLORS.warn;
  return BENCHMARK_DROP_COLORS.bad;
}
