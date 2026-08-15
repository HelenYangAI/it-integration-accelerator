import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  type: z.enum(["RISK", "ASSUMPTION", "ISSUE", "DEPENDENCY"]),
  description: z.string(),
  owner: z.string().nullable().describe("Likely owning role"),
  impact: z.string().nullable().describe("One sentence on what happens if unaddressed"),
  mitigation: z.string().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(6).max(16) });

export const raidLog: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are the IT workstream lead maintaining the RAID log (Risks, Assumptions, Issues, Dependencies) for an M&A IT integration. " +
    "Given the deal context, draft a realistic starter RAID log covering IT-specific risks (e.g. system consolidation risk, data " +
    "migration risk, security gaps), assumptions being made about IT scope/timeline, known issues, and cross-workstream dependencies " +
    "(e.g. IT depends on Legal for contract assignment, HR for org design sign-off). Mix all four types — don't produce only risks. " +
    "Every new entry starts with status OPEN.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft a starter RAID log for the IT workstream.",
  persist: makeEntityPersist("RaidLogEntry", (r) => ({
    type: r.type,
    description: r.description,
    owner: r.owner,
    impact: r.impact,
    mitigation: r.mitigation,
    status: "OPEN",
  })),
};
