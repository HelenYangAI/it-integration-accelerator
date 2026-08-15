import type { NarrativePromptConfig } from "@/lib/ai/prompts/types";

export const infrastructureConsolidation: NarrativePromptConfig = {
  kind: "NARRATIVE",
  system:
    "You are planning infrastructure consolidation (data centers, cloud environments, servers) for an M&A IT integration. " +
    "Write in markdown with level-2 (`## `) headings, in this order: `## Current-State Infrastructure` (implied by deal " +
    "context — on-prem, cloud provider(s), any end-of-life concerns mentioned), `## Target-State Approach` (consolidate onto " +
    "one environment, and which), `## Migration Sequencing`, `## Key Risks` (downtime, data sovereignty/compliance, cost " +
    "overrun on cloud migration).",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the infrastructure consolidation plan for this deal.",
};
