import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      {/* ── Badge ── */}
      <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
        ✦ Free AI Spend Audit
      </span>

      {/* ── Headline ── */}
      <h1 className="text-5xl font-bold text-foreground max-w-3xl leading-tight">
        Find out how much your team is overpaying for AI tools
      </h1>

      {/* ── Subtext ── */}
      <p className="text-lg text-muted-foreground max-w-xl">
        2-minute audit. No signup. Get a personalised savings report instantly.
      </p>

      {/* ── CTA ── */}
      <Link
        href="/audit"
        className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
      >
        Start Free Audit →
      </Link>
    </section>
  );
}
