interface Props {
  totalSavings: number;
}

// Renders a Credex consultation CTA only when monthly savings exceed $500.
// Returns null for lower-savings audits — no CTA shown.
export default function CredexCTA({ totalSavings }: Props) {
  if (totalSavings <= 500) return null;

  const annualSavings = (totalSavings * 12).toFixed(0);

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 flex flex-col gap-3">

      {/* ── Headline ── */}
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
          High Savings Detected
        </p>
        <h2 className="text-xl font-bold text-foreground">
          You&apos;re leaving ${annualSavings}/year on the table
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Teams saving this much often have deeper inefficiencies a quick audit call can surface.
          Credex consultations are free and take 20 minutes.
        </p>
      </div>

      {/* ── CTA ── */}
      <a
        href="#lead-capture"
        className="self-start bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm"
      >
        Book a Free Credex Consultation →
      </a>

    </div>
  );
}
