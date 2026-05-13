import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { audits } from "@/db/schema";
import type { Metadata } from "next";
import type { AuditResult } from "@/types/audit";
import AuditResultCard from "@/components/audit/AuditResultCard";
import LeadCaptureForm from "@/components/audit/LeadCaptureForm";
import ShareButtons from "@/components/audit/ShareButtons";
import CredexCTA from "@/components/audit/CredexCTA";
import SavingsHero from "@/components/audit/SavingsHero";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generates per-audit Open Graph and Twitter card meta tags for social sharing.
// Runs server-side before the page renders — has full DB access.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const audit = await db.query.audits.findFirst({
    where: eq(audits.slug, slug),
  });

  if (!audit) return {};

  const results     = audit.results as AuditResult[];
  const title       = audit.totalSavings > 0
    ? `AI Spend Audit — $${audit.totalSavings.toFixed(0)}/mo in savings`
    : "AI Spend Audit — You're spending well";

  const topResult   = results[0];
  const description = topResult?.savings > 0
    ? `${topResult.toolName} → ${topResult.recommendedToolName} saves $${topResult.savings.toFixed(0)}/mo. Total: $${audit.totalSavings.toFixed(0)}/month in savings.`
    : "Your AI tool spend has been audited. See the full breakdown.";

  const imageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/og?slug=${slug}`;
  const pageUrl  = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:    pageUrl,
      type:   "website",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [imageUrl],
    },
  };
}

export default async function AuditResultPage({ params }: Props) {
  const { slug } = await params;

  const audit = await db.query.audits.findFirst({
    where: eq(audits.slug, slug),
  });

  if (!audit) notFound();

  const results = audit.results as AuditResult[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

      {/* ── Savings hero ── */}
      <SavingsHero totalSavings={audit.totalSavings} toolCount={results.length} />

      {/* ── Credex CTA (high savings only) ── */}
      <CredexCTA totalSavings={audit.totalSavings} />

      {/* ── Per-tool result cards ── */}
      <div className="flex flex-col gap-4">
        {results.map((r) => (
          <AuditResultCard key={r.toolId} result={r} />
        ))}
      </div>

      {/* ── AI Summary ── */}
      {audit.summary && (
        <div className="bg-background2 border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            AI Summary
          </p>
          <p className="text-foreground text-sm leading-relaxed">{audit.summary}</p>
        </div>
      )}

      {/* ── Share buttons ── */}
      <ShareButtons totalSavings={audit.totalSavings} slug={audit.slug} />

      {/* ── Lead capture ── */}
      <div id="lead-capture">
        <LeadCaptureForm totalSavings={audit.totalSavings} slug={audit.slug} />
      </div>

    </div>
  );
}
