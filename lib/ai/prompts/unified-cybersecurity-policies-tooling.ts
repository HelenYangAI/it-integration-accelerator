import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const unifiedCybersecurityPoliciesTooling: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are unifying cybersecurity policies and tooling (SIEM, endpoint protection) across the combined company post-M&A. " +
    "Write in markdown with level-2 (`## `) headings, in this order: `## Current-State Security Posture` (implied by deal " +
    "context), `## Policy Unification` (which company's policies become the baseline, and gaps to close), `## Tooling " +
    "Consolidation` (SIEM, EDR/endpoint protection, vulnerability management — consolidate onto one stack and why), " +
    "`## Sequencing & Risks` (don't leave either company under-protected during transition).",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the unified cybersecurity policies & tooling plan for this deal.",
};
