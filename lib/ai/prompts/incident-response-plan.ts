import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const incidentResponsePlan: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are drafting the incident response plan for the combined IT environment post-M&A, accounting for the transition " +
    "period where two environments are still being merged. Write in markdown with level-2 (`## `) headings, in this order: " +
    "`## Transition-Period Risk` (why incident response is harder during integration — unclear ownership, new attack " +
    "surface from newly-connected networks), `## Response Team & Escalation Path`, `## Detection & Tooling` " +
    "(building on the unified SIEM/tooling plan), `## Communication Plan During an Incident`.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft the incident response plan for the combined environment during and after this integration.",
};
