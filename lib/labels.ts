export const DEAL_TYPE_LABELS: Record<string, string> = {
  BOLT_ON: "Bolt-on",
  TUCK_IN: "Tuck-in",
  MERGER_OF_EQUALS: "Merger of Equals",
  CARVE_OUT: "Carve-out",
  OTHER: "Other",
};

export const COMPANY_ROLE_LABELS: Record<string, string> = {
  ACQUIRER: "Acquirer",
  TARGET: "Target",
};

export const IT_FUNCTION_LABELS: Record<string, string> = {
  INFRASTRUCTURE: "Infrastructure",
  APPLICATIONS: "Applications",
  SECURITY: "Security",
  DATA: "Data",
  END_USER_COMPUTE: "End User Compute",
  SERVICE_DESK: "Service Desk",
  PMO: "IT PMO",
};

export const ITEM_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
};

export const ITEM_STATUS_BADGE_CLASSES: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  IN_PROGRESS: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  COMPLETE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export const RAG_STATUS_LABELS: Record<string, string> = {
  GREEN: "On Track",
  AMBER: "At Risk",
  RED: "Blocked",
};

export const RAG_STATUS_COLORS: Record<string, string> = {
  GREEN: "bg-emerald-500",
  AMBER: "bg-amber-500",
  RED: "bg-red-500",
};

export const RAG_STATUS_BADGE_CLASSES: Record<string, string> = {
  GREEN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  AMBER: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  RED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export const ITEM_PHASE_LABELS: Record<string, string> = {
  DAY1: "Day 1",
  DAY100: "Day 100",
  LONG_TERM: "Long Term",
  ONGOING: "Ongoing",
};

export const RENDER_KIND_LABELS: Record<string, string> = {
  NARRATIVE: "Narrative",
  TABLE: "Table",
  CHECKLIST: "Checklist",
};

export const ASSET_TYPE_LABELS: Record<string, string> = {
  APP: "Application",
  SERVER: "Server",
  DATACENTER: "Datacenter",
  CLOUD_SERVICE: "Cloud Service",
  NETWORK: "Network",
};

export const CRITICALITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const DATA_SENSITIVITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  RESTRICTED: "Restricted",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  BLOCKED: "Blocked",
};
