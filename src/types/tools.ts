export type ToolCategory = "coding" | "chat" | "api";

export type UsageLevel = "minimal" | "light" | "moderate" | "heavy" | "power";

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPricePerSeat: number;
  minSeats?: number;
  // What usage level this plan is designed for — used by audit engine
  targetUsage: UsageLevel;
  usageSummary: string;
}

export interface ApiModel {
  id: string;
  name: string;
  inputPricePer1MTokens: number;
  outputPricePer1MTokens: number;
}

export interface Alternative {
  toolId: string;
  reason: string;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: ToolCategory;
  plans: SubscriptionPlan[];
  // API-based tools (Anthropic API, OpenAI API, Gemini API)
  apiModels?: ApiModel[];
  // Other tools that could replace this one
  alternatives: Alternative[];
}
