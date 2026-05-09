import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-background2 py-24 px-4">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        {/* ── Badge ── */}
        <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
          ✦ Get Started Today
        </span>

        {/* ── Headline ── */}
        <h2 className="text-4xl font-bold text-foreground">
          Ready to stop overpaying for AI?
        </h2>

        {/* ── Subtext ── */}
        <p className="text-lg text-muted-foreground">
          Join teams already saving thousands. Free audit, no signup required.
        </p>

        {/* ── CTA Button ── */}
        <Link
          href="/audit"
          className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          Start Free Audit →
        </Link>
      </div>
    </section>
  );
}
