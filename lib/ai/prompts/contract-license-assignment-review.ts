import { z } from "zod";
import type { StructuredPromptConfig } from "@/lib/ai/prompts/types";
import { makeEntityPersist } from "@/lib/ai/prompts/entityPersist";

const rowSchema = z.object({
  vendor: z.string(),
  contractName: z.string(),
  changeOfControlClause: z.boolean().describe("Whether this type of contract commonly includes a change-of-control clause requiring vendor consent before assignment"),
  consentRequired: z.boolean(),
  annualCost: z.number().nullable(),
});

const schema = z.object({ items: z.array(rowSchema).min(5).max(15) });

export const contractLicenseAssignmentReview: StructuredPromptConfig<typeof schema> = {
  kind: "TABLE",
  schema,
  system:
    "You are an IT/legal integration analyst conducting a Contract & License Assignment Review — flagging which major IT " +
    "vendor contracts and software licenses likely contain change-of-control clauses requiring vendor consent before the " +
    "contract can transfer to the acquirer (or continue under new ownership). Base your list on typical enterprise IT vendor " +
    "categories implied by the industry and company sizes in context (e.g. ERP, CRM, cloud infrastructure, cybersecurity " +
    "tooling, telephony). Flag change-of-control risk conservatively — major enterprise SaaS/infrastructure contracts commonly " +
    "have these clauses; smaller subscriptions typically don't.",
  buildPrompt: (context) =>
    `Here is the deal context:\n\n${context.text}\n\n` +
    "Draft a starter contract/license assignment review for this deal's likely IT vendor contracts.",
  persist: makeEntityPersist("ContractLicenseItem", (r: z.infer<typeof rowSchema>) => ({
    vendor: r.vendor,
    contractName: r.contractName,
    changeOfControlClause: r.changeOfControlClause,
    consentRequired: r.consentRequired,
    consentStatus: r.consentRequired ? "PENDING" : "NOT_REQUIRED",
    annualCost: r.annualCost,
  })),
};
