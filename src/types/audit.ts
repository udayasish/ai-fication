// Represents one tool row in the form
export interface ToolEntry {
  toolId: string; // matches Tool.id from tools.ts
  planId: string; // matches SubscriptionPlan.id — empty string if no plan selected
  monthlySpend: number; // what the team currently pays per month
  seats: number; // number of seats — 0 for API/usage-based tools
  included: boolean; // whether this tool is included in the audit
}

// The full form data submitted by the user
export interface AuditFormData {
  teamSize: number;
  useCase: string;
  tools: ToolEntry[];
}
