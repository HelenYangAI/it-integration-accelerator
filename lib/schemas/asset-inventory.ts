import { z } from "zod";

export const assetInventoryItemSchema = z.object({
  assetType: z.enum(["APP", "SERVER", "DATACENTER", "CLOUD_SERVICE", "NETWORK"]),
  name: z.string().min(1),
  owner: z.string().nullable().optional(),
  businessUnit: z.string().nullable().optional(),
  users: z.number().int().nullable().optional(),
  annualCost: z.number().nullable().optional(),
  criticality: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).nullable().optional(),
  overlapWithOtherCompany: z.enum(["NONE", "PARTIAL", "FULL"]).nullable().optional(),
  equivalentAsset: z.string().nullable().optional(),
  dataSensitivity: z.enum(["LOW", "MEDIUM", "HIGH", "RESTRICTED"]).nullable().optional(),
  contractEndDate: z.string().nullable().optional(),
  companySource: z.enum(["ACQUIRER", "TARGET"]),
  notes: z.string().nullable().optional(),
});

export const assetInventoryItemUpdateSchema = assetInventoryItemSchema.partial();

export const assetInventoryImportCommitSchema = z.object({
  rows: z.array(z.record(z.string(), z.string())),
  mapping: z.record(z.string(), z.string().nullable()),
  companySource: z.enum(["ACQUIRER", "TARGET"]),
});
