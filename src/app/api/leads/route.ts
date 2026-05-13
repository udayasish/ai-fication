import { NextRequest, NextResponse } from "next/server";
import { LeadSchema } from "@/lib/validators/lead";
import { saveLead } from "@/services/lead.service";
import { leadsRatelimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // 1. Rate limit by IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
  const { success } = await leadsRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 2. Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 3. Validate with Zod
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 4. Save lead + send email
  try {
    await saveLead(parsed.data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Audit not found") {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  // 5. Return success
  return NextResponse.json({ success: true }, { status: 201 });
}
