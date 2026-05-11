import type { Tool } from "@/types/tools";

export const TOOLS: Tool[] = [
  // ── Coding Assistants ──────────────────────────────────────────────────────

  {
    id: "cursor",
    name: "Cursor",
    vendor: "Cursor",
    category: "coding",
    alternatives: [
      { toolId: "github_copilot", reason: "GitHub Copilot Pro is $10/seat vs Cursor Pro at $20/seat for similar AI coding features" },
      { toolId: "windsurf", reason: "Windsurf Pro is $20/seat with comparable features to Cursor Pro" },
    ],
    plans: [
      {
        id: "cursor_hobby",
        name: "Hobby",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "Limited completions and agent requests per month",
      },
      {
        id: "cursor_pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        targetUsage: "moderate",
        usageSummary: "Unlimited tab completions, $20/mo usage credits for premium models",
      },
      {
        id: "cursor_business",
        name: "Business",
        monthlyPricePerSeat: 40,
        targetUsage: "heavy",
        usageSummary: "Pro-equivalent AI + admin controls, centralized billing, shared team rules",
      },
    ],
  },

  {
    id: "github_copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "coding",
    alternatives: [
      { toolId: "cursor", reason: "Cursor Pro offers more agentic AI features at $20/seat" },
      { toolId: "windsurf", reason: "Windsurf Pro offers deeper codebase context at $20/seat" },
    ],
    plans: [
      {
        id: "copilot_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "2,000 completions/month, 50 chat requests/month — individuals only",
      },
      {
        id: "copilot_pro",
        name: "Pro",
        monthlyPricePerSeat: 10,
        targetUsage: "moderate",
        usageSummary: "Unlimited completions, unlimited chat",
      },
      {
        id: "copilot_business",
        name: "Business",
        monthlyPricePerSeat: 19,
        targetUsage: "heavy",
        usageSummary: "Org-level controls, centralized billing, audit logs",
      },
      {
        id: "copilot_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        targetUsage: "power",
        usageSummary: "Enterprise security, policy controls, fine-tuned models",
      },
    ],
  },

  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "coding",
    alternatives: [
      { toolId: "cursor", reason: "Cursor Pro is $20/seat with a larger plugin ecosystem" },
      { toolId: "github_copilot", reason: "GitHub Copilot Pro is $10/seat for teams already on GitHub" },
    ],
    plans: [
      {
        id: "windsurf_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "Limited AI interactions per month",
      },
      {
        id: "windsurf_pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        targetUsage: "moderate",
        usageSummary: "Full AI features for individual developers",
      },
      {
        id: "windsurf_teams",
        name: "Teams",
        monthlyPricePerSeat: 40,
        targetUsage: "heavy",
        usageSummary: "Organizational features, centralized billing, team management",
      },
    ],
  },

  // ── Chat AI ────────────────────────────────────────────────────────────────

  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    alternatives: [
      { toolId: "chatgpt", reason: "ChatGPT Plus is $20/month with comparable capabilities to Claude Pro" },
      { toolId: "gemini", reason: "Gemini AI Pro is $19.99/month and includes Google Workspace integration" },
    ],
    plans: [
      {
        id: "claude_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "Limited messages per day",
      },
      {
        id: "claude_pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        targetUsage: "moderate",
        usageSummary: "5x more usage than Free, priority access",
      },
      {
        id: "claude_max_5x",
        name: "Max (5x)",
        monthlyPricePerSeat: 100,
        targetUsage: "heavy",
        usageSummary: "5x more usage than Pro, priority access to new models",
      },
      {
        id: "claude_max_20x",
        name: "Max (20x)",
        monthlyPricePerSeat: 200,
        targetUsage: "power",
        usageSummary: "20x more usage than Pro",
      },
      {
        id: "claude_team_standard",
        name: "Team Standard",
        monthlyPricePerSeat: 25,
        minSeats: 5,
        targetUsage: "moderate",
        usageSummary: "1.25x more usage per session than Pro, team admin controls",
      },
      {
        id: "claude_team_premium",
        name: "Team Premium",
        monthlyPricePerSeat: 125,
        minSeats: 5,
        targetUsage: "heavy",
        usageSummary: "6.25x more usage than Pro, includes Claude Code access",
      },
    ],
  },

  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    alternatives: [
      { toolId: "claude", reason: "Claude Pro is $20/month and is often preferred for writing and analysis tasks" },
      { toolId: "gemini", reason: "Gemini AI Pro is $19.99/month and integrates with Google Workspace" },
    ],
    plans: [
      {
        id: "chatgpt_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "Limited GPT-4o access",
      },
      {
        id: "chatgpt_plus",
        name: "Plus",
        monthlyPricePerSeat: 20,
        targetUsage: "moderate",
        usageSummary: "Standard advanced model access, DALL-E, Advanced Data Analysis",
      },
      {
        id: "chatgpt_pro",
        name: "Pro",
        monthlyPricePerSeat: 200,
        targetUsage: "power",
        usageSummary: "Highest usage limits, o1 pro mode, extended thinking",
      },
      {
        id: "chatgpt_business",
        name: "Business",
        monthlyPricePerSeat: 25,
        targetUsage: "heavy",
        usageSummary: "Team collaboration, no training on your data, admin console",
      },
    ],
  },

  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    alternatives: [
      { toolId: "claude", reason: "Claude Pro is $20/month with stronger reasoning and writing capabilities" },
      { toolId: "chatgpt", reason: "ChatGPT Plus is $20/month with broader tool integrations" },
    ],
    plans: [
      {
        id: "gemini_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        targetUsage: "minimal",
        usageSummary: "Basic Gemini access",
      },
      {
        id: "gemini_ai_plus",
        name: "AI Plus",
        monthlyPricePerSeat: 7.99,
        targetUsage: "light",
        usageSummary: "128K context, 200 monthly AI credits, 200 GB storage",
      },
      {
        id: "gemini_ai_pro",
        name: "AI Pro",
        monthlyPricePerSeat: 19.99,
        targetUsage: "moderate",
        usageSummary: "Gemini Pro access, 1M token context, Gemini in Gmail/Docs/Sheets, 2 TB storage",
      },
      {
        id: "gemini_ai_ultra",
        name: "AI Ultra",
        monthlyPricePerSeat: 249.99,
        targetUsage: "power",
        usageSummary: "All models including Deep Think and Veo, 30 TB storage, $100/mo Google Cloud credits",
      },
    ],
  },

  // ── API Tools ──────────────────────────────────────────────────────────────

  {
    id: "anthropic_api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    alternatives: [
      { toolId: "openai_api", reason: "GPT-4o mini is significantly cheaper at $0.15/$0.60 per 1M tokens for lighter workloads" },
      { toolId: "gemini_api", reason: "Gemini 2.5 Pro is $1.25/$10.00 per 1M tokens vs Claude 3.5 Sonnet at $3.00/$15.00" },
    ],
    plans: [],
    apiModels: [
      { id: "claude_3_haiku",    name: "Claude 3 Haiku",    inputPricePer1MTokens: 0.25,  outputPricePer1MTokens: 1.25  },
      { id: "claude_3_5_haiku",  name: "Claude 3.5 Haiku",  inputPricePer1MTokens: 0.80,  outputPricePer1MTokens: 4.00  },
      { id: "claude_3_5_sonnet", name: "Claude 3.5 Sonnet", inputPricePer1MTokens: 3.00,  outputPricePer1MTokens: 15.00 },
      { id: "claude_sonnet_4_5", name: "Claude Sonnet 4.5", inputPricePer1MTokens: 3.00,  outputPricePer1MTokens: 15.00 },
      { id: "claude_sonnet_4_6", name: "Claude Sonnet 4.6", inputPricePer1MTokens: 3.00,  outputPricePer1MTokens: 15.00 },
      { id: "claude_opus_4",     name: "Claude Opus 4",     inputPricePer1MTokens: 15.00, outputPricePer1MTokens: 75.00 },
    ],
  },

  {
    id: "openai_api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    alternatives: [
      { toolId: "anthropic_api", reason: "Claude Sonnet 4.5 matches GPT-4o quality at $3.00/$15.00 per 1M tokens" },
      { toolId: "gemini_api",    reason: "Gemini 2.5 Flash is $0.15/$0.60 per 1M tokens — cheaper than GPT-4o mini for most workloads" },
    ],
    plans: [],
    apiModels: [
      { id: "gpt_4o_mini",  name: "GPT-4o mini",  inputPricePer1MTokens: 0.15, outputPricePer1MTokens: 0.60  },
      { id: "gpt_4_1_mini", name: "GPT-4.1 mini", inputPricePer1MTokens: 0.40, outputPricePer1MTokens: 1.60  },
      { id: "gpt_4o",       name: "GPT-4o",        inputPricePer1MTokens: 2.50, outputPricePer1MTokens: 10.00 },
      { id: "gpt_4_1",      name: "GPT-4.1",       inputPricePer1MTokens: 2.00, outputPricePer1MTokens: 8.00  },
      { id: "o4_mini",      name: "o4-mini",        inputPricePer1MTokens: 1.10, outputPricePer1MTokens: 4.40  },
    ],
  },

  {
    id: "gemini_api",
    name: "Gemini API",
    vendor: "Google",
    category: "api",
    alternatives: [
      { toolId: "anthropic_api", reason: "Claude 3 Haiku is $0.25/$1.25 per 1M tokens — cheaper than Gemini 2.5 Pro for high-volume use" },
      { toolId: "openai_api",    reason: "GPT-4o mini is $0.15/$0.60 per 1M tokens — comparable to Gemini 2.5 Flash at similar quality" },
    ],
    plans: [],
    apiModels: [
      { id: "gemini_1_5_flash", name: "Gemini 1.5 Flash", inputPricePer1MTokens: 0.075, outputPricePer1MTokens: 0.30  },
      { id: "gemini_2_0_flash", name: "Gemini 2.0 Flash", inputPricePer1MTokens: 0.10,  outputPricePer1MTokens: 0.40  },
      { id: "gemini_2_5_flash", name: "Gemini 2.5 Flash", inputPricePer1MTokens: 0.15,  outputPricePer1MTokens: 0.60  },
      { id: "gemini_2_5_pro",   name: "Gemini 2.5 Pro",   inputPricePer1MTokens: 1.25,  outputPricePer1MTokens: 10.00 },
    ],
  },
];

// Quick lookup map by tool id
export const TOOLS_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
