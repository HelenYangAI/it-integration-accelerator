export type ColumnType = "text" | "textarea" | "number" | "date" | "boolean" | "select" | "referenceSelect";

export type ColumnConfig = {
  key: string;
  label: string;
  type: ColumnType;
  required?: boolean;
  options?: { value: string; label: string }[]; // for "select"
  refEntity?: string; // for "referenceSelect" — another key in ENTITY_CONFIGS
  refLabelField?: string; // which field on the referenced row to show as the option label
  width?: string;
};

export type EntityConfig = {
  /** Prisma model name, PascalCase — matches ItemTemplate.linkedEntity and doubles as the Prisma client delegate name once lowercased. */
  model: string;
  label: string;
  columns: ColumnConfig[];
  defaultValues: Record<string, unknown>;
};

const DEAL_TYPE_OPTIONS = [
  { value: "ACQUIRER", label: "Acquirer" },
  { value: "TARGET", label: "Target" },
];

export const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  RaciEntry: {
    model: "RaciEntry",
    label: "Governance Model (RACI)",
    columns: [
      { key: "activity", label: "Activity", type: "text", required: true },
      { key: "responsible", label: "Responsible (R)", type: "text" },
      { key: "accountable", label: "Accountable (A)", type: "text" },
      { key: "consulted", label: "Consulted (C)", type: "text" },
      { key: "informed", label: "Informed (I)", type: "text" },
      { key: "stakeholderGroup", label: "Stakeholder Group", type: "text" },
    ],
    defaultValues: { activity: "New activity" },
  },
  RaidLogEntry: {
    model: "RaidLogEntry",
    label: "RAID Log",
    columns: [
      {
        key: "type", label: "Type", type: "select", required: true,
        options: ["RISK", "ASSUMPTION", "ISSUE", "DEPENDENCY"].map((v) => ({ value: v, label: v })),
      },
      { key: "description", label: "Description", type: "text", required: true },
      { key: "owner", label: "Owner", type: "text" },
      { key: "impact", label: "Impact", type: "text" },
      {
        key: "status", label: "Status", type: "select",
        options: ["OPEN", "MITIGATED", "CLOSED", "ESCALATED"].map((v) => ({ value: v, label: v })),
      },
      { key: "mitigation", label: "Mitigation", type: "textarea" },
      { key: "dateRaised", label: "Date Raised", type: "date" },
    ],
    defaultValues: { type: "RISK", description: "New risk" },
  },
  BudgetLineItem: {
    model: "BudgetLineItem",
    label: "Budget & Cost Tracking",
    columns: [
      { key: "category", label: "Category", type: "text", required: true },
      { key: "description", label: "Description", type: "text", required: true },
      { key: "estimatedCost", label: "Estimated Cost", type: "number", required: true },
      { key: "actualCost", label: "Actual Cost", type: "number" },
      {
        key: "costType", label: "Cost Type", type: "select", required: true,
        options: ["CAPEX", "OPEX"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "timing", label: "Timing", type: "select", required: true,
        options: ["ONE_TIME", "RUN_RATE"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "phase", label: "Phase", type: "select",
        options: ["DAY1", "DAY100", "LONG_TERM", "ONGOING"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "relatedSynergyItemId", label: "Related Synergy", type: "referenceSelect",
        refEntity: "SynergyItem", refLabelField: "description",
      },
    ],
    defaultValues: { category: "New line item", description: "New line item", estimatedCost: 0, costType: "OPEX", timing: "ONE_TIME" },
  },
  SynergyItem: {
    model: "SynergyItem",
    label: "IT Synergy List & Cost-to-Achieve",
    columns: [
      {
        key: "category", label: "Category", type: "select", required: true,
        options: ["LICENSE_CONSOLIDATION", "INFRA_CONSOLIDATION", "CONTRACT_RENEGOTIATION", "HEADCOUNT_OVERLAP", "OTHER"].map((v) => ({ value: v, label: v })),
      },
      { key: "description", label: "Description", type: "text", required: true },
      { key: "annualValue", label: "Annual Value", type: "number" },
      { key: "oneTimeCostToAchieve", label: "One-Time Cost to Achieve", type: "number" },
      { key: "realizationYear", label: "Realization Year", type: "number" },
      {
        key: "validationStatus", label: "Validation Status", type: "select",
        options: ["NOT_VALIDATED", "IN_PROGRESS", "VALIDATED", "AT_RISK"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "confidenceLevel", label: "Confidence", type: "select",
        options: ["LOW", "MEDIUM", "HIGH"].map((v) => ({ value: v, label: v })),
      },
      { key: "rationale", label: "Rationale", type: "textarea" },
    ],
    defaultValues: { category: "OTHER", description: "New synergy" },
  },
  TsaRequirement: {
    model: "TsaRequirement",
    label: "TSA Requirements",
    columns: [
      { key: "service", label: "Service", type: "text", required: true },
      { key: "provider", label: "Provider", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
      { key: "monthlyCost", label: "Monthly Cost", type: "number" },
      { key: "exitCriteria", label: "Exit Criteria", type: "textarea" },
      {
        key: "status", label: "Status", type: "select",
        options: ["PLANNED", "ACTIVE", "EXITED"].map((v) => ({ value: v, label: v })),
      },
    ],
    defaultValues: { service: "New TSA service" },
  },
  ContractLicenseItem: {
    model: "ContractLicenseItem",
    label: "Contract & License Register",
    columns: [
      { key: "vendor", label: "Vendor", type: "text", required: true },
      { key: "contractName", label: "Contract Name", type: "text", required: true },
      { key: "changeOfControlClause", label: "Change-of-Control Clause", type: "boolean" },
      { key: "consentRequired", label: "Consent Required", type: "boolean" },
      {
        key: "consentStatus", label: "Consent Status", type: "select",
        options: ["NOT_REQUIRED", "PENDING", "REQUESTED", "OBTAINED", "DENIED"].map((v) => ({ value: v, label: v })),
      },
      { key: "renewalDate", label: "Renewal Date", type: "date" },
      { key: "annualCost", label: "Annual Cost", type: "number" },
      { key: "overlapFlag", label: "Overlaps with Other Company", type: "boolean" },
      {
        key: "rationalizationAction", label: "Rationalization Action", type: "select",
        options: ["KEEP", "RETIRE", "CONSOLIDATE", "MIGRATE"].map((v) => ({ value: v, label: v })),
      },
    ],
    defaultValues: { vendor: "New vendor", contractName: "New contract" },
  },
  RunbookStep: {
    model: "RunbookStep",
    label: "Cutover/Go-Live Runbooks",
    columns: [
      { key: "runbookName", label: "Runbook", type: "text", required: true },
      { key: "stepOrder", label: "Step #", type: "number", required: true },
      { key: "description", label: "Step Description", type: "text", required: true },
      { key: "owner", label: "Owner", type: "text" },
      { key: "rollbackPlan", label: "Rollback Plan", type: "textarea" },
      {
        key: "status", label: "Status", type: "select",
        options: ["NOT_STARTED", "IN_PROGRESS", "DONE", "BLOCKED"].map((v) => ({ value: v, label: v })),
      },
    ],
    defaultValues: { runbookName: "New runbook", stepOrder: 1, description: "New step" },
  },
  Milestone: {
    model: "Milestone",
    label: "IT Integration Roadmap",
    columns: [
      { key: "title", label: "Milestone", type: "text", required: true },
      { key: "tag", label: "Workstream Tag", type: "text" },
      {
        key: "phase", label: "Phase", type: "select", required: true,
        options: ["DAY1", "DAY100", "LONG_TERM"].map((v) => ({ value: v, label: v })),
      },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "dueDate", label: "Due Date", type: "date" },
      {
        key: "status", label: "Status", type: "select",
        options: ["NOT_STARTED", "IN_PROGRESS", "COMPLETE"].map((v) => ({ value: v, label: v })),
      },
      {
        key: "ragStatus", label: "RAG", type: "select",
        options: ["GREEN", "AMBER", "RED"].map((v) => ({ value: v, label: v })),
      },
      { key: "owner", label: "Owner", type: "text" },
    ],
    defaultValues: { title: "New milestone", phase: "DAY100" },
  },
  RationalizationItem: {
    model: "RationalizationItem",
    label: "Application Rationalization",
    columns: [
      {
        key: "assetInventoryItemId", label: "Application/Asset", type: "referenceSelect", required: true,
        refEntity: "AssetInventoryItem", refLabelField: "name",
      },
      {
        key: "recommendation", label: "Recommendation", type: "select", required: true,
        options: ["KEEP", "RETIRE", "CONSOLIDATE", "MIGRATE"].map((v) => ({ value: v, label: v })),
      },
      { key: "rationale", label: "Rationale", type: "textarea" },
      { key: "estimatedSynergyImpact", label: "Synergy Impact", type: "number" },
      { key: "estimatedOneTimeCost", label: "One-Time Cost", type: "number" },
      { key: "targetDate", label: "Target Date", type: "date" },
      {
        key: "confidence", label: "Confidence", type: "select",
        options: ["LOW", "MEDIUM", "HIGH"].map((v) => ({ value: v, label: v })),
      },
    ],
    defaultValues: { recommendation: "KEEP" },
  },
  ItOrgNode: {
    model: "ItOrgNode",
    label: "IT Org Design",
    columns: [
      { key: "scope", label: "Scope", type: "select", required: true, options: [...DEAL_TYPE_OPTIONS, { value: "FUTURE_STATE", label: "Future State" }] },
      {
        key: "parentId", label: "Reports To", type: "referenceSelect",
        refEntity: "ItOrgNode", refLabelField: "title",
      },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "name", label: "Name", type: "text" },
      {
        key: "function", label: "Function", type: "select",
        options: ["INFRASTRUCTURE", "APPLICATIONS", "SECURITY", "DATA", "END_USER_COMPUTE", "SERVICE_DESK", "PMO"].map((v) => ({ value: v, label: v })),
      },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    defaultValues: { scope: "FUTURE_STATE", title: "New role", level: 0 },
  },
};

export function getEntityConfig(model: string): EntityConfig | undefined {
  return ENTITY_CONFIGS[model];
}

export function toDelegateName(model: string): string {
  return model.charAt(0).toLowerCase() + model.slice(1);
}
