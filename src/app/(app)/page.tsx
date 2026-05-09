import SpendForm from "@/components/audit/SpendForm";

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section>
        <h1>Find out how much your team is overpaying for AI tools</h1>
        <p>Free 2-minute audit. Get a personalised savings report instantly.</p>
      </section>

      {/* ── Spend Form ── */}
      <section>
        <SpendForm />
      </section>
    </div>
  );
}
