import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const dataMigration: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning IT data migration for an M&A integration. Write in markdown with level-2 (`## `) headings, in this " +
    "order: `## Data Domains In Scope` (systems/data implied by the deal context — customer, financial, clinical/operational " +
    "as relevant to the industry), `## Mapping & Cleansing Approach`, `## Validation Strategy` (how correctness gets confirmed " +
    "before cutover), `## Cutover Strategy` (big-bang vs. phased, and why), `## Key Risks`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the data migration plan for this deal.",
};
