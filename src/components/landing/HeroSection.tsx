import Link from "next/link";
import { HERO } from "@/lib/constants/landingPage";

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      {/* ── Badge ── */}
      <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
        {HERO.badge}
      </span>

      {/* ── Headline ── */}
      <h1 className="text-5xl font-bold text-foreground max-w-3xl leading-tight">
        {HERO.headline}
      </h1>

      {/* ── Subtext ── */}
      <p className="text-lg text-muted-foreground max-w-xl">
        {HERO.subtext}
      </p>

      {/* ── CTA ── */}
      <Link
        href={HERO.ctaHref}
        className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
      >
        {HERO.cta}
      </Link>
    </section>
  );
}
