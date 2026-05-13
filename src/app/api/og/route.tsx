import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { audits } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AuditResult } from "@/types/audit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // 1. Read slug from query string
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return new Response("Missing slug", { status: 400 });

  // 2. Fetch audit from DB
  const audit = await db.query.audits.findFirst({
    where: eq(audits.slug, slug),
  });
  if (!audit) return new Response("Not found", { status: 404 });

  // 3. Build tool lines — max 3 to avoid overflow
  const results   = audit.results as AuditResult[];
  const toolLines = results.slice(0, 3).map((r) =>
    r.savings > 0
      ? `${r.toolName}  →  ${r.recommendedToolName}   −$${r.savings.toFixed(0)}/mo`
      : `${r.toolName}  →  Already optimal`
  );

  // 4. Return PNG image
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a1e1e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          gap: "32px",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ color: "#6ee7b7", fontSize: "24px", margin: "0" }}>
          AI Spend Audit
        </p>

        <h1 style={{ color: "#ffffff", fontSize: "72px", margin: "0", lineHeight: "1" }}>
          {audit.totalSavings > 0
            ? `$${audit.totalSavings.toFixed(0)}/mo in savings`
            : "You're spending well"}
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {toolLines.map((line, i) => (
            <p key={i} style={{ color: "#94a3b8", fontSize: "28px", margin: "0" }}>
              {line}
            </p>
          ))}
        </div>

        <p style={{ color: "#4b5563", fontSize: "22px", margin: "0", marginTop: "auto" }}>
          {(process.env.NEXT_PUBLIC_APP_URL ?? "").replace("https://", "").replace("http://", "")}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
