const STEPS = [
  {
    number: "01",
    title: "Enter your tools",
    description: "Tell us which AI tools your team uses and what you currently pay.",
  },
  {
    number: "02",
    title: "We analyse",
    description: "Our engine checks your usage against every available plan and alternative.",
  },
  {
    number: "03",
    title: "Get your report",
    description: "See exactly where you're overspending and what to switch to.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background2 py-24 px-4">
      <div className="max-w-5xl mx-auto text-center flex flex-col gap-12">
        {/* ── Heading ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-foreground">How it works</h2>
          <p className="text-muted-foreground">Three steps to your personalised savings report</p>
        </div>

        {/* ── Steps grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="bg-surface rounded-xl p-8 flex flex-col gap-3 text-left">
              <span className="text-4xl font-bold text-primary">{step.number}</span>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
