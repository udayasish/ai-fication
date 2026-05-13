"use client";

import { useState } from "react";

interface Props {
  totalSavings: number;
  slug: string;
}

export default function LeadCaptureForm({ totalSavings, slug }: Props) {
  const [email,       setEmail]       = useState("");
  const [company,     setCompany]     = useState("");
  const [role,        setRole]        = useState("");
  const [teamSize,    setTeamSize]    = useState("");
  const [isLoading,   setIsLoading]   = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const hasSignificantSavings = totalSavings >= 100;

  // Sends lead data to POST /api/leads and shows success state on completion.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, teamSize: teamSize ? Number(teamSize) : undefined, auditSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.issues?.fieldErrors?.email?.[0] ?? "Something went wrong. Please try again.");
        return;
      }
      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-background2 border border-border rounded-xl p-6 text-center">
        <p className="text-lg font-semibold text-foreground">Check your inbox ✓</p>
        <p className="text-sm text-muted-foreground mt-1">
          We&apos;ve sent your audit report to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background2 border border-border rounded-xl p-6 flex flex-col gap-4">

      {/* ── Headline ── */}
      <div>
        <p className="text-base font-semibold text-foreground">
          {hasSignificantSavings
            ? `Save $${totalSavings.toFixed(0)}/month — get your full report`
            : "You're spending well"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {hasSignificantSavings
            ? "Enter your email and we'll send you a copy of this audit."
            : "We'll notify you when new optimizations apply to your stack."}
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          />
          <input
            type="number"
            min={1}
            placeholder="Team size (optional)"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending…" : hasSignificantSavings ? "Get My Report →" : "Notify Me →"}
        </button>
      </form>

    </div>
  );
}
