interface Props {
  totalSavings: number;
  toolCount: number;
}

// Renders the hero savings card at the top of the audit results page.
// Shows monthly and annual savings prominently with visual emphasis.
export default function SavingsHero({ totalSavings, toolCount }: Props) {
  const annualSavings = totalSavings * 12;
  const hasSignificantSavings = totalSavings > 0;

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center text-center gap-6 overflow-hidden">

      {/* ── Glow effect ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* ── Badge ── */}
      <p className="relative text-xs font-semibold text-primary uppercase tracking-widest">
        ✦ Your AI Spend Audit
      </p>

      {hasSignificantSavings ? (
        <>
          {/* ── Monthly savings ── */}
          <div className="relative flex flex-col items-center gap-1">
            <p className="text-6xl font-bold text-primary leading-none">
              ${totalSavings.toFixed(0)}
              <span className="text-2xl font-medium text-primary/70 ml-1">/mo</span>
            </p>
            <p className="text-sm text-muted-foreground">projected monthly savings</p>
          </div>

          {/* ── Divider ── */}
          <div className="relative w-full flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">that&apos;s</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* ── Annual savings ── */}
          <div className="relative flex flex-col items-center gap-1">
            <p className="text-4xl font-bold text-foreground leading-none">
              ${annualSavings.toFixed(0)}
              <span className="text-xl font-medium text-muted-foreground ml-1">/year</span>
            </p>
            <p className="text-sm text-muted-foreground">back in your budget</p>
          </div>
        </>
      ) : (
        /* ── Already optimal state ── */
        <div className="relative flex flex-col items-center gap-2">
          <p className="text-4xl font-bold text-green-500">✓ Already optimal</p>
          <p className="text-sm text-muted-foreground">
            Your team is spending efficiently on AI tools
          </p>
        </div>
      )}

      {/* ── Tool count ── */}
      <p className="relative text-xs text-muted-foreground">
        across {toolCount} {toolCount === 1 ? "tool" : "tools"} audited
      </p>

    </div>
  );
}
