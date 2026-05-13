import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { audits, leads } from "@/db/schema";
import { resend } from "@/lib/resend";
import type { LeadValues } from "@/lib/validators/lead";
import type { AuditResult } from "@/types/audit";

// ── Email builder ──────────────────────────────────────────────────────────────

// Builds the HTML body for the transactional audit summary email.
// Kept in this file — only ever used here.
function buildEmailHtml(
  results: AuditResult[],
  totalSavings: number,
  reportUrl: string
): string {
  const toolLines = results
    .map((r) => {
      const action =
        r.savings > 0
          ? `Switch to ${r.recommendedToolName} — save $${r.savings.toFixed(0)}/mo`
          : `Already optimal — no change needed`;
      return `<li><strong>${r.toolName}:</strong> ${action}</li>`;
    })
    .join("\n");

  const closing =
    totalSavings >= 500
      ? `<p>A member of the Credex team will reach out about discounted AI credits that can capture even more of these savings.</p>`
      : `<p>We'll notify you when new optimizations apply to your stack.</p>`;

  return `
    <h2>Your AI Spend Audit Results</h2>
    <p><strong>Total projected savings: $${totalSavings.toFixed(0)}/month ($${(totalSavings * 12).toFixed(0)}/year)</strong></p>
    <ul>${toolLines}</ul>
    ${closing}
    <p><a href="${reportUrl}">View your full report →</a></p>
  `;
}

// ── Main export ────────────────────────────────────────────────────────────────

// Saves a lead to the DB and sends a transactional audit summary email.
// Throws if the audit slug does not exist in the DB.
export async function saveLead(data: LeadValues): Promise<void> {
  // 1. Find the audit — needed for DB foreign key and email content
  const audit = await db.query.audits.findFirst({
    where: eq(audits.slug, data.auditSlug),
  });
  if (!audit) throw new Error("Audit not found");

  // 2. Insert lead into DB
  await db.insert(leads).values({
    id:       nanoid(),
    auditId:  audit.id,
    email:    data.email,
    company:  data.company ?? null,
    role:     data.role ?? null,
    teamSize: data.teamSize ? String(data.teamSize) : null,
  });

  // 3. Build + send email (non-fatal — lead is already saved if this fails)
  const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${data.auditSlug}`;
  const results   = audit.results as AuditResult[];
  const subject   =
    audit.totalSavings >= 100
      ? `Your AI Spend Audit — $${audit.totalSavings.toFixed(0)}/mo in savings found`
      : `Your AI Spend Audit — You're already spending well`;

  try {
    await resend.emails.send({
      from:    "audit@yourdomain.com",
      to:      data.email,
      subject,
      html:    buildEmailHtml(results, audit.totalSavings, reportUrl),
    });
  } catch (err) {
    // Email failed — lead is already saved, so do not throw
    console.error("[leads] Resend email failed:", err);
  }
}
