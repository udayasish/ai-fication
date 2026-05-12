import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { AuditFormSchema } from "@/lib/validators/audit";
import { runAudit } from "@/services/audit.service";
import { gemini } from "@/lib/gemini";
import { db } from "@/lib/db";
import { audits } from "@/db/schema";
import type { AuditFormValues } from "@/lib/validators/audit";
import type { AuditOutput } from "@/types/audit";

// ── Prompt builder ─────────────────────────────────────────────────────────────

// Builds the Gemini prompt from validated form data + audit results.
// Kept in this file because it is only ever used here.
function buildGeminiPrompt(formData: AuditFormValues, output: AuditOutput): string {
  const toolLines = output.results.map((r) => {
    const saving = r.savings > 0
      ? `Save $${r.savings.toFixed(0)}/mo by switching to ${r.recommendedToolName} ${r.recommendedPlanName}`
      : `Already on best value with ${r.toolName}`;
    return `- ${r.toolName}: ${saving}`;
  });

  return `You are an AI spend advisor. A team of ${formData.teamSize} ran an AI tools audit.
Their primary use case: ${formData.useCase}.
Audit results:
${toolLines.join("\n")}
Total projected savings: $${output.totalSavings.toFixed(0)}/month.

Write a 3–4 sentence personalised summary for this team. Be specific, direct, and encouraging.
Mention the biggest saving opportunity by name. Do not use bullet points.
Do not include generic advice — only speak to their actual results.`;
}

// ── POST /api/audit ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Validate with Zod
  const parsed = AuditFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const formData = parsed.data;

  // 3. Run the audit engine (pure, no I/O)
  const auditOutput = runAudit(formData);

  // 4. Generate AI summary via Gemini (non-fatal — summary is optional)
  let summary: string | null = null;
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildGeminiPrompt(formData, auditOutput);
    const result = await model.generateContent(prompt);
    summary = result.response.text().trim();
  } catch (err) {
    // Summary generation failed — proceed without it, results are still valid
    console.error("[audit] Gemini summary failed:", err);
  }

  // 5. Persist to DB
  const id    = nanoid();
  const now   = new Date();
  const month = now.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const day   = now.getDate();
  const slug  = `ai-audit-${month}-${day}-${nanoid(6)}`;

  await db.insert(audits).values({
    id,
    slug,
    formData,
    results: auditOutput.results,
    totalSavings: auditOutput.totalSavings,
    summary,
  });

  // 6. Return slug so client can redirect to /audit/[slug]
  return NextResponse.json({ slug }, { status: 201 });
}
