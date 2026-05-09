import SpendForm from "@/components/audit/SpendForm";

export default function AuditPage() {
  return (
    <div>
      {/* ── Page heading ── */}
      <section>
        <h1>Audit your AI spend</h1>
        <p>Enter what your team currently pays. We'll show you where you're overspending.</p>
      </section>

      {/* ── Audit form ── */}
      <section>
        <SpendForm />
      </section>
    </div>
  );
}
