import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const masterDataManagement: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning master data management (deduping/reconciling customer and vendor records across systems) for an M&A " +
    "IT integration. Write in markdown with level-2 (`## `) headings, in this order: `## Where Duplication Is Likely` " +
    "(customer, vendor, product records across the two companies' systems), `## Matching & Reconciliation Approach`, " +
    "`## Golden Record Ownership` (who decides which record wins when they conflict), `## Risks of Getting This Wrong` " +
    "(billing errors, reporting inaccuracy, customer-facing duplicates).",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the master data management plan for this deal.",
};
