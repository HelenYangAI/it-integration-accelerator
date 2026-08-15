import { z } from "zod";

export const dealTypeEnum = z.enum([
  "BOLT_ON",
  "TUCK_IN",
  "MERGER_OF_EQUALS",
  "CARVE_OUT",
  "OTHER",
]);

export const companyRoleEnum = z.enum(["ACQUIRER", "TARGET"]);

export const itFunctionEnum = z.enum([
  "INFRASTRUCTURE",
  "APPLICATIONS",
  "SECURITY",
  "DATA",
  "END_USER_COMPUTE",
  "SERVICE_DESK",
  "PMO",
]);

// Schema fields intentionally mirror raw form values (plain strings, "" for
// "unset") rather than coercing/transforming at the zod layer — coupling a
// zod .transform()/.preprocess() to react-hook-form's zodResolver creates an
// input/output type mismatch that breaks TFieldValues inference. Semantic
// normalization (numeric parsing, "" -> null) happens once, in lib/deal.ts,
// the single place that writes this data to Prisma.

export const companySchema = z.object({
  role: companyRoleEnum,
  name: z.string().min(1, "Company name is required"),
  size: z.string().optional(),
  revenue: z.string().optional(),
  employeeCount: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  headquarters: z.string().optional(),
});

export const itOrgNodeSchema = z.object({
  clientId: z.string(),
  parentClientId: z.string(),
  scope: z.enum(["ACQUIRER", "TARGET"]),
  title: z.string().min(1, "Title is required"),
  name: z.string().optional(),
  function: z.union([itFunctionEnum, z.literal("")]).optional(),
  notes: z.string().optional(),
});

export const dealIntakeSchema = z.object({
  name: z.string().min(1, "Deal name is required"),
  dealType: dealTypeEnum,
  industry: z.string().min(1, "Industry is required"),
  dealThesis: z.string().min(1, "Deal thesis is required"),
  shortTermGoals: z.string().min(1, "Short-term goals are required"),
  longTermGoals: z.string().min(1, "Long-term goals are required"),
  currentStateDescription: z.string().min(1, "Current-state description is required"),
  companies: z.array(companySchema).length(2, "Both acquirer and target company info are required"),
  itOrgNodes: z.array(itOrgNodeSchema),
});

export type DealIntakeInput = z.infer<typeof dealIntakeSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type ItOrgNodeInput = z.infer<typeof itOrgNodeSchema>;
