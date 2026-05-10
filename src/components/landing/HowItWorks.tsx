import { HOW_IT_WORKS } from "@/lib/constants/landingPage";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background2 py-24 px-4">
      <div className="max-w-5xl mx-auto text-center flex flex-col gap-12">
        {/* ── Heading ── */}
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
            {HOW_IT_WORKS.badge}
          </span>
          <h2 className="text-3xl font-bold text-foreground">
            {HOW_IT_WORKS.heading}
          </h2>
          <p className="text-muted-foreground">{HOW_IT_WORKS.subtext}</p>
        </div>

        {/* ── Steps grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface rounded-xl p-8 flex flex-col gap-3 text-left"
            >
              <span className="text-4xl font-bold text-primary">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
