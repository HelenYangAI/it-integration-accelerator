import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const accessControlsAuditTrail: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning steady-state access controls and audit trail continuity for the combined company post-M&A (distinct " +
    "from the one-time Day 1 access provisioning/deprovisioning rush). Write in markdown with level-2 (`## `) headings, in " +
    "this order: `## Target Access Model` (RBAC/least-privilege approach for the combined identity environment), " +
    "`## Audit Trail Continuity` (ensuring access/change logs aren't lost across the transition, relevant for the industry's " +
    "compliance needs), `## Periodic Access Review Process`, `## Key Risks`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the access controls & audit trail continuity plan for this deal.",
};
