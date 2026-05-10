export const HERO = {
  badge: "✦ Free AI Spend Audit",
  headline: "Find out how much your team is overpaying for AI tools",
  subtext: "2-minute audit. No signup. Get a personalised savings report instantly.",
  cta: "Start Free Audit →",
  ctaHref: "/audit",
};

export const HOW_IT_WORKS = {
  badge: "✦ Simple Process",
  heading: "How it works",
  subtext: "Three steps to your personalised savings report",
  steps: [
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
  ],
};

export const TOOLS_SECTION = {
  badge: "✦ 8 Tools Supported",
  heading: "Tools we cover",
  subtext: "We audit 8 of the most widely used AI tools",
  categoryLabels: {
    coding: "AI Code Editor",
    chat: "AI Assistant",
    api: "API Access",
  } as Record<string, string>,
};

export const CTA_SECTION = {
  badge: "✦ Get Started Today",
  headline: "Ready to stop overpaying for AI?",
  subtext: "Join teams already saving thousands. Free audit, no signup required.",
  cta: "Start Free Audit →",
  ctaHref: "/audit",
};

export const FOOTER = {
  copyright: "© 2025 AI Spend Audit.",
  poweredByText: "Powered by",
  poweredByLabel: "Credex",
  poweredByHref: "https://credex.rocks",
};
