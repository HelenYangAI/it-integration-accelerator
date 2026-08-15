import type { PromptConfig } from "@/lib/ai/prompts/types";

// Assessment & Planning
import { itDueDiligenceValidation } from "@/lib/ai/prompts/it-due-diligence-validation";
import { appInfraInventory } from "@/lib/ai/prompts/app-infra-inventory";
import { appRationalizationPlan } from "@/lib/ai/prompts/app-rationalization-plan";
import { itIntegrationRoadmap } from "@/lib/ai/prompts/it-integration-roadmap";
import { budgetSynergyCostToAchieve } from "@/lib/ai/prompts/budget-synergy-cost-to-achieve";
import { tsaRequirements } from "@/lib/ai/prompts/tsa-requirements";
import { contractLicenseAssignmentReview } from "@/lib/ai/prompts/contract-license-assignment-review";

// Governance & Tracking
import { standUpImoItFunction } from "@/lib/ai/prompts/stand-up-imo-it-function";
import { governanceModel } from "@/lib/ai/prompts/governance-model";
import { budgetCostTracking } from "@/lib/ai/prompts/budget-cost-tracking";
import { raidLog } from "@/lib/ai/prompts/raid-log";
import { cutoverRunbooks } from "@/lib/ai/prompts/cutover-runbooks";
import { postMigrationHypercare } from "@/lib/ai/prompts/post-migration-hypercare";
import { projectPlanStakeholderAlignment } from "@/lib/ai/prompts/project-plan-stakeholder-alignment";
import { integrationTestingUatPlan } from "@/lib/ai/prompts/integration-testing-uat-plan";

// Day 1 Readiness
import { networkConnectivity } from "@/lib/ai/prompts/network-connectivity";
import { hardwareProvisioning } from "@/lib/ai/prompts/hardware-provisioning";
import { emailIdentity } from "@/lib/ai/prompts/email-identity";
import { telephonyCollaboration } from "@/lib/ai/prompts/telephony-collaboration";
import { cybersecurityBaseline } from "@/lib/ai/prompts/cybersecurity-baseline";
import { businessContinuity } from "@/lib/ai/prompts/business-continuity";
import { helpdeskSupportCoverage } from "@/lib/ai/prompts/helpdesk-support-coverage";
import { day1ChangeManagementComms } from "@/lib/ai/prompts/day1-change-management-comms";

// Org & Change Management
import { itOrgDesign } from "@/lib/ai/prompts/it-org-design";
import { vendorContractRationalization } from "@/lib/ai/prompts/vendor-contract-rationalization";
import { trainingChangeManagement } from "@/lib/ai/prompts/training-change-management";
import { ongoingCommunicationPlan } from "@/lib/ai/prompts/ongoing-communication-plan";

// Post-Day 1 — Core Integration
import { erpConsolidation } from "@/lib/ai/prompts/erp-consolidation";
import { crmIntegration } from "@/lib/ai/prompts/crm-integration";
import { dataMigration } from "@/lib/ai/prompts/data-migration";
import { masterDataManagement } from "@/lib/ai/prompts/master-data-management";
import { infrastructureConsolidation } from "@/lib/ai/prompts/infrastructure-consolidation";
// app-decommissioning-schedule intentionally has no AI prompt — it shares the
// RationalizationItem table (unique per asset) with app-rationalization-plan,
// so it's manual-only for now to avoid unique-constraint collisions between
// the two AI "suggest" actions.
import { licenseReconciliationContractConsolidation } from "@/lib/ai/prompts/license-reconciliation-contract-consolidation";
import { endpointDeviceStandardization } from "@/lib/ai/prompts/endpoint-device-standardization";
import { itAssetDisposition } from "@/lib/ai/prompts/it-asset-disposition";
import { websiteDomainDnsTransition } from "@/lib/ai/prompts/website-domain-dns-transition";

// Security & Compliance
import { unifiedCybersecurityPoliciesTooling } from "@/lib/ai/prompts/unified-cybersecurity-policies-tooling";
import { dataPrivacyCompliance } from "@/lib/ai/prompts/data-privacy-compliance";
import { accessControlsAuditTrail } from "@/lib/ai/prompts/access-controls-audit-trail";
import { incidentResponsePlan } from "@/lib/ai/prompts/incident-response-plan";
import { disasterRecoveryBackup } from "@/lib/ai/prompts/disaster-recovery-backup";

// Each entry keeps its own concrete schema type in its source file; the
// registry necessarily erases that to the PromptConfig union so the generate
// route can look items up generically by key.
const registry: Record<string, PromptConfig> = {
  "it-due-diligence-validation": itDueDiligenceValidation,
  "app-infra-inventory": appInfraInventory as unknown as PromptConfig,
  "app-rationalization-plan": appRationalizationPlan as unknown as PromptConfig,
  "it-integration-roadmap": itIntegrationRoadmap as unknown as PromptConfig,
  "budget-synergy-cost-to-achieve": budgetSynergyCostToAchieve as unknown as PromptConfig,
  "tsa-requirements": tsaRequirements as unknown as PromptConfig,
  "contract-license-assignment-review": contractLicenseAssignmentReview as unknown as PromptConfig,

  "stand-up-imo-it-function": standUpImoItFunction,
  "governance-model": governanceModel as unknown as PromptConfig,
  "budget-cost-tracking": budgetCostTracking as unknown as PromptConfig,
  "raid-log": raidLog as unknown as PromptConfig,
  "cutover-runbooks": cutoverRunbooks as unknown as PromptConfig,
  "post-migration-hypercare": postMigrationHypercare,
  "project-plan-stakeholder-alignment": projectPlanStakeholderAlignment,
  "integration-testing-uat-plan": integrationTestingUatPlan,

  "network-connectivity": networkConnectivity as unknown as PromptConfig,
  "hardware-provisioning": hardwareProvisioning as unknown as PromptConfig,
  "email-identity": emailIdentity as unknown as PromptConfig,
  "telephony-collaboration": telephonyCollaboration as unknown as PromptConfig,
  "cybersecurity-baseline": cybersecurityBaseline as unknown as PromptConfig,
  "business-continuity": businessContinuity as unknown as PromptConfig,
  "helpdesk-support-coverage": helpdeskSupportCoverage,
  "day1-change-management-comms": day1ChangeManagementComms,

  "it-org-design": itOrgDesign as unknown as PromptConfig,
  "vendor-contract-rationalization": vendorContractRationalization as unknown as PromptConfig,
  "training-change-management": trainingChangeManagement,
  "ongoing-communication-plan": ongoingCommunicationPlan,

  "erp-consolidation": erpConsolidation,
  "crm-integration": crmIntegration,
  "data-migration": dataMigration,
  "master-data-management": masterDataManagement,
  "infrastructure-consolidation": infrastructureConsolidation,
  "license-reconciliation-contract-consolidation": licenseReconciliationContractConsolidation as unknown as PromptConfig,
  "endpoint-device-standardization": endpointDeviceStandardization as unknown as PromptConfig,
  "it-asset-disposition": itAssetDisposition as unknown as PromptConfig,
  "website-domain-dns-transition": websiteDomainDnsTransition as unknown as PromptConfig,

  "unified-cybersecurity-policies-tooling": unifiedCybersecurityPoliciesTooling,
  "data-privacy-compliance": dataPrivacyCompliance,
  "access-controls-audit-trail": accessControlsAuditTrail,
  "incident-response-plan": incidentResponsePlan,
  "disaster-recovery-backup": disasterRecoveryBackup,
};

export function getPromptConfig(itemKey: string): PromptConfig | undefined {
  return registry[itemKey];
}
