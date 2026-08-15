import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const erpConsolidation: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning ERP consolidation (finance, HR, procurement) for an M&A IT integration. Write in markdown with " +
    "level-2 (`## `) headings, in this order: `## Current-State ERP Landscape` (what's implied by the deal context for each " +
    "company), `## Target-State Approach` (consolidate onto one platform, keep both with integration, or phased migration — " +
    "recommend one and say why), `## Key Risks` (data migration, process differences, close-the-books continuity), " +
    "`## Sequencing & Dependencies`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the ERP consolidation plan for this deal.",
};
