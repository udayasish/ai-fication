import SpendForm from "@/components/audit/SpendForm";
import { AUDIT_PAGE } from "@/lib/constants/auditPage";

export default function AuditPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-10">
      {/* ── Page heading ── */}
      <section className="px-6">
        <h1 className="text-4xl font-bold text-foreground">
          {AUDIT_PAGE.heading}
        </h1>
        <p className="text-muted-foreground mt-2">{AUDIT_PAGE.subtext}</p>
      </section>

      {/* ── Audit form card ── */}
      <section className="bg-surface border border-border rounded-2xl p-8">
        <SpendForm />
      </section>
    </div>
  );
}
