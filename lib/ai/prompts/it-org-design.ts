import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  title: z.string().describe("Role title, e.g. 'CIO', 'Director of Infrastructure', 'Service Desk Manager'"),
  name: z.string().nullable().describe("Leave null — names aren't known at this stage"),
  function: z
    .enum(["INFRASTRUCTURE", "APPLICATIONS", "SECURITY", "DATA", "END_USER_COMPUTE", "SERVICE_DESK", "PMO"])
    .nullable(),
  notes: z.string().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(5).max(14) });

export const itOrgDesign: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are designing the target-state IT organization for the combined company after an M&A integration. Given the deal " +
    "context (company sizes, deal type, current IT org structure if provided), propose a target-state IT org: role titles " +
    "spanning the key functions (Infrastructure, Applications, Security, Data, End User Compute, Service Desk, IT PMO/Governance), " +
    "sized appropriately — a bolt-on of a small target usually doesn't need a full duplicate leadership layer, while a merger of " +
    "equals may need to. Do not invent names; leave `name` null.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` + "Draft the target-state (future-state) IT org design for this deal.",
  persist: makeEntityPersist("ItOrgNode", (r: z.infer<typeof rowSchema>) => ({
    scope: "FUTURE_STATE",
    title: r.title,
    name: r.name,
    function: r.function,
    notes: r.notes,
    level: 0,
  })),
};
