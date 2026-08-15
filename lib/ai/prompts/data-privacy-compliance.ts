import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const dataPrivacyCompliance: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are assessing data privacy compliance (GDPR, CCPA, and industry-specific regs like HIPAA/PCI-DSS/SOX as applicable) " +
    "for the combined company post-M&A. Write in markdown with level-2 (`## `) headings, in this order: `## Applicable " +
    "Regimes` (infer from industry and any geography clues in context — call out if a regulated data type like health or " +
    "payment data is implied), `## Compliance Gaps to Assess`, `## Data Handling During Migration` (privacy risk specific to " +
    "the migration itself), `## Recommended Next Steps`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the data privacy compliance assessment for this deal.",
};
