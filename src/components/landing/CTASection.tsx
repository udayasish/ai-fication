import Link from "next/link";
import { CTA_SECTION } from "@/lib/constants/landingPage";

export default function CTASection() {
  return (
    <section className="bg-background2 py-24 px-4">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        {/* ── Badge ── */}
        <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
          {CTA_SECTION.badge}
        </span>

        {/* ── Headline ── */}
        <h2 className="text-4xl font-bold text-foreground">
          {CTA_SECTION.headline}
        </h2>

        {/* ── Subtext ── */}
        <p className="text-lg text-muted-foreground">
          {CTA_SECTION.subtext}
        </p>

        {/* ── CTA Button ── */}
        <Link
          href={CTA_SECTION.ctaHref}
          className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          {CTA_SECTION.cta}
        </Link>
      </div>
    </section>
  );
}
