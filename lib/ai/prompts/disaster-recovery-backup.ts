import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const disasterRecoveryBackup: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are validating the disaster recovery / backup strategy for the combined entity post-M&A. Write in markdown with " +
    "level-2 (`## `) headings, in this order: `## Current-State DR/Backup Posture` (implied by deal context for each " +
    "company, including any end-of-life infrastructure noted), `## Gaps for the Combined Entity` (RTO/RPO mismatches, " +
    "coverage gaps during migration), `## Target-State Approach`, `## Validation & Testing Plan`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the disaster recovery / backup strategy validation for this deal's combined entity.",
};
