import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const crmIntegration: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning CRM and customer-facing systems integration for an M&A IT integration. Write in markdown with " +
    "level-2 (`## `) headings, in this order: `## Current-State CRM/Customer Systems` (implied by deal context), " +
    "`## Target-State Approach` (consolidate vs. coexist vs. migrate, tied to the deal thesis — especially relevant if the " +
    "thesis involves cross-selling), `## Customer-Facing Continuity Risks` (support tickets, quoting, order history), " +
    "`## Sequencing & Dependencies`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the CRM and customer-facing systems integration plan for this deal.",
};
