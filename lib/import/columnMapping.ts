export type ImportTargetField = {
  key: string;
  label: string;
  required?: boolean;
  synonyms: string[];
};

export const ASSET_INVENTORY_TARGET_FIELDS: ImportTargetField[] = [
  { key: "name", label: "Asset name", required: true, synonyms: ["name", "asset", "assetname", "application", "app", "system", "systemname"] },
  { key: "assetType", label: "Asset type", synonyms: ["type", "assettype", "category"] },
  { key: "owner", label: "Owner", synonyms: ["owner", "assetowner", "businessowner", "itowner", "contact"] },
  { key: "businessUnit", label: "Business unit", synonyms: ["businessunit", "bu", "department", "division", "team"] },
  { key: "users", label: "User count", synonyms: ["users", "usercount", "numusers", "seats", "licenses"] },
  { key: "annualCost", label: "Annual cost", synonyms: ["annualcost", "cost", "spend", "annualspend", "price"] },
  { key: "criticality", label: "Criticality", synonyms: ["criticality", "priority", "tier", "importance"] },
  { key: "dataSensitivity", label: "Data sensitivity", synonyms: ["datasensitivity", "sensitivity", "classification"] },
  { key: "contractEndDate", label: "Contract end date", synonyms: ["contractenddate", "contractend", "renewaldate", "expirationdate", "expiry"] },
  { key: "notes", label: "Notes", synonyms: ["notes", "comments", "description", "remarks"] },
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Deterministic best-effort column mapping suggestion, so the user has a starting point to confirm/correct rather than mapping every column from scratch. */
export function suggestColumnMapping(
  headers: string[],
  targetFields: ImportTargetField[]
): Record<string, string | null> {
  const normalizedHeaders = headers.map((h) => ({ raw: h, norm: normalize(h) }));
  const used = new Set<string>();
  const mapping: Record<string, string | null> = {};

  for (const field of targetFields) {
    const synonymsNorm = field.synonyms.map(normalize);
    const match = normalizedHeaders.find(
      (h) => !used.has(h.raw) && synonymsNorm.includes(h.norm)
    );
    if (match) {
      mapping[field.key] = match.raw;
      used.add(match.raw);
      continue;
    }
    const partial = normalizedHeaders.find(
      (h) => !used.has(h.raw) && synonymsNorm.some((s) => h.norm.includes(s) || s.includes(h.norm))
    );
    if (partial) {
      mapping[field.key] = partial.raw;
      used.add(partial.raw);
      continue;
    }
    mapping[field.key] = null;
  }

  return mapping;
}
