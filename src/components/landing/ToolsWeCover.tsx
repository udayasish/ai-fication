import { TOOLS } from "@/lib/constants/tools";

const CATEGORY_LABEL: Record<string, string> = {
  coding: "AI Code Editor",
  chat: "AI Assistant",
  api: "API Access",
};

export default function ToolsWeCover() {
  return (
    <section className="bg-background py-24 px-4">
      <div className="max-w-5xl mx-auto text-center flex flex-col gap-12">
        {/* ── Heading ── */}
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block border border-primary text-primary text-sm font-medium px-4 py-1 rounded-full">
            ✦ 8 Tools Supported
          </span>
          <h2 className="text-3xl font-bold text-foreground">Tools we cover</h2>
          <p className="text-muted-foreground">We audit 8 of the most widely used AI tools</p>
        </div>

        {/* ── Tool cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <div key={tool.id} className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-base font-semibold text-foreground">{tool.name}</span>
              <span className="text-xs text-muted-foreground">{CATEGORY_LABEL[tool.category]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
