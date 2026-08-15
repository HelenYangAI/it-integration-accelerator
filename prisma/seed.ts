import { prisma } from "../lib/db";
import type { RenderKind } from "../generated/prisma/enums";

type ItemSeed = {
  key: string;
  title: string;
  description: string;
  renderKind: RenderKind;
  linkedEntity: string | null;
};

type CategorySeed = {
  slug: string;
  name: string;
  items: ItemSeed[];
};

const CATALOG: CategorySeed[] = [
  {
    slug: "assessment-planning",
    name: "Assessment & Planning",
    items: [
      {
        key: "it-due-diligence-validation",
        title: "IT Due Diligence Validation",
        description:
          "Confirm deal thesis, synergy targets, integration goals, and risks/concerns post-close.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "app-infra-inventory",
        title: "Application & Infrastructure Inventory",
        description:
          "Application & infrastructure inventory, both companies — standard template, then convert/populate from whatever inventory each side provides.",
        renderKind: "TABLE",
        linkedEntity: "AssetInventoryItem",
      },
      {
        key: "app-rationalization-plan",
        title: "Application Rationalization Plan",
        description: "Keep, retire, consolidate, or migrate.",
        renderKind: "TABLE",
        linkedEntity: "RationalizationItem",
      },
      {
        key: "it-integration-roadmap",
        title: "IT Integration Roadmap",
        description: "Day 1, Day 100, and long-term milestones.",
        renderKind: "TABLE",
        linkedEntity: "Milestone",
      },
      {
        key: "budget-synergy-cost-to-achieve",
        title: "IT Integration Budget & Synergy Cost-to-Achieve Estimate",
        description: "IT integration budget and synergy cost-to-achieve estimate.",
        renderKind: "TABLE",
        linkedEntity: "SynergyItem",
      },
      {
        key: "tsa-requirements",
        title: "TSA Requirements",
        description: "TSA requirements, if seller is providing interim IT support.",
        renderKind: "TABLE",
        linkedEntity: "TsaRequirement",
      },
      {
        key: "contract-license-assignment-review",
        title: "Contract/License Assignment Review",
        description:
          "Flag change-of-control clauses that require vendor consent before systems can transfer.",
        renderKind: "TABLE",
        linkedEntity: "ContractLicenseItem",
      },
    ],
  },
  {
    slug: "governance-tracking",
    name: "Governance & Tracking",
    items: [
      {
        key: "stand-up-imo-it-function",
        title: "Stand Up IMO IT Function",
        description: "Stand up the IMO IT function.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "governance-model",
        title: "Governance Model",
        description: "Who owns what, stakeholder map, decision rights.",
        renderKind: "TABLE",
        linkedEntity: "RaciEntry",
      },
      {
        key: "budget-cost-tracking",
        title: "Budget & Cost Tracking",
        description: "Budget and cost tracking (capex/opex, one-time vs. run-rate).",
        renderKind: "TABLE",
        linkedEntity: "BudgetLineItem",
      },
      {
        key: "raid-log",
        title: "RAID Log",
        description: "Risks, assumptions, issues, dependencies.",
        renderKind: "TABLE",
        linkedEntity: "RaidLogEntry",
      },
      {
        key: "cutover-runbooks",
        title: "Cutover/Go-Live Runbooks",
        description: "Cutover/go-live runbooks for major migrations.",
        renderKind: "TABLE",
        linkedEntity: "RunbookStep",
      },
      {
        key: "post-migration-hypercare",
        title: "Post-Migration Validation & Hypercare",
        description: "Post-migration validation and hypercare support period.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "project-plan-stakeholder-alignment",
        title: "Project Plan Alignment with Business Stakeholders",
        description: "Project plan alignment with business stakeholders.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "integration-testing-uat-plan",
        title: "Integration Testing / UAT Plan",
        description: "Integration testing/UAT plan for major system cutovers.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
    ],
  },
  {
    slug: "day1-readiness",
    name: "Day 1 Readiness",
    items: [
      {
        key: "network-connectivity",
        title: "Network Connectivity",
        description: "Set up or transfer internet/VPN for the acquired company.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "hardware-provisioning",
        title: "Hardware Provisioning",
        description: "PCs, laptops, printers, tablets, phones, cameras, etc.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "email-identity",
        title: "Email and Identity",
        description: "AD/SSO integration or federation, email history migration.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "telephony-collaboration",
        title: "Telephony & Collaboration Tools",
        description: "Phone systems, Teams/Slack, video conferencing.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "cybersecurity-baseline",
        title: "Cybersecurity Baseline",
        description:
          "Access provisioning/deprovisioning (critical for departing employees), cyber insurance, protocols, immediate risk remediation.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "business-continuity",
        title: "Business Continuity",
        description:
          "Ensure uninterrupted payroll, ERP, CRM access via TSA/VPN, interim solution, or new standalone instance if no TSA.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "helpdesk-support-coverage",
        title: "Helpdesk/Support Coverage",
        description: "Helpdesk/support coverage for combined workforce.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "day1-change-management-comms",
        title: "Day 1 Change Management & Communications",
        description:
          "Employee readiness on what's changing vs. not, customer/vendor notifications.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
    ],
  },
  {
    slug: "org-change-management",
    name: "Org & Change Management",
    items: [
      {
        key: "it-org-design",
        title: "IT Org Design",
        description: "Target-state team structure, reporting lines.",
        renderKind: "TABLE",
        linkedEntity: "ItOrgNode",
      },
      {
        key: "vendor-contract-rationalization",
        title: "Vendor/Contract Rationalization",
        description: "Dedupe overlapping SaaS tools.",
        renderKind: "TABLE",
        linkedEntity: "ContractLicenseItem",
      },
      {
        key: "training-change-management",
        title: "Training & Change Management",
        description: "Training and change management for new/changed systems.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "ongoing-communication-plan",
        title: "Ongoing Communication Plan",
        description: "Ongoing communication plan for major cutover milestones (post-Day 1).",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
    ],
  },
  {
    slug: "post-day1-core-integration",
    name: "Post-Day 1 — Core Integration",
    items: [
      {
        key: "erp-consolidation",
        title: "ERP Consolidation",
        description: "Finance, HR, procurement.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "crm-integration",
        title: "CRM & Customer-Facing Systems Integration",
        description: "CRM and customer-facing systems integration.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "data-migration",
        title: "Data Migration",
        description: "Mapping, cleansing, validation, cutover strategy.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "master-data-management",
        title: "Master Data Management",
        description: "Dedupe/reconcile customer and vendor records across systems.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "infrastructure-consolidation",
        title: "Infrastructure Consolidation",
        description: "Data centers, cloud environments, servers.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "app-decommissioning-schedule",
        title: "Application Decommissioning Schedule",
        description: "Application decommissioning schedule.",
        renderKind: "TABLE",
        linkedEntity: "RationalizationItem",
      },
      {
        key: "license-reconciliation-contract-consolidation",
        title: "Software License Reconciliation & Vendor Contract Consolidation",
        description: "Software license reconciliation and vendor contract consolidation.",
        renderKind: "TABLE",
        linkedEntity: "ContractLicenseItem",
      },
      {
        key: "endpoint-device-standardization",
        title: "Endpoint/Device Standardization",
        description: "Endpoint/device standardization.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "it-asset-disposition",
        title: "IT Asset Disposition",
        description: "Secure data wipe/destruction for decommissioned hardware.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
      {
        key: "website-domain-dns-transition",
        title: "Website/Domain/DNS Transition",
        description: "Website/domain/DNS transition, if applicable.",
        renderKind: "CHECKLIST",
        linkedEntity: null,
      },
    ],
  },
  {
    slug: "security-compliance",
    name: "Security & Compliance",
    items: [
      {
        key: "unified-cybersecurity-policies-tooling",
        title: "Unified Cybersecurity Policies & Tooling",
        description: "SIEM, endpoint protection.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "data-privacy-compliance",
        title: "Data Privacy Compliance",
        description:
          "GDPR, CCPA, and industry-specific regs like HIPAA/PCI-DSS/SOX as applicable.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "access-controls-audit-trail",
        title: "Access Controls & Audit Trail Continuity",
        description: "Access controls and audit trail continuity.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "incident-response-plan",
        title: "Incident Response Plan",
        description: "Incident response plan for the combined environment.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
      {
        key: "disaster-recovery-backup",
        title: "Disaster Recovery / Backup Strategy",
        description: "Disaster recovery/backup strategy validated for the combined entity.",
        renderKind: "NARRATIVE",
        linkedEntity: null,
      },
    ],
  },
];

async function main() {
  let categoryOrder = 0;
  for (const category of CATALOG) {
    categoryOrder += 1;
    const savedCategory = await prisma.integrationCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: categoryOrder },
      create: { slug: category.slug, name: category.name, order: categoryOrder },
    });

    let itemOrder = 0;
    for (const item of category.items) {
      itemOrder += 1;
      await prisma.itemTemplate.upsert({
        where: { key: item.key },
        update: {
          categoryId: savedCategory.id,
          title: item.title,
          description: item.description,
          renderKind: item.renderKind,
          linkedEntity: item.linkedEntity,
          order: itemOrder,
        },
        create: {
          key: item.key,
          categoryId: savedCategory.id,
          title: item.title,
          description: item.description,
          renderKind: item.renderKind,
          linkedEntity: item.linkedEntity,
          order: itemOrder,
        },
      });
    }
  }

  const categoryCount = await prisma.integrationCategory.count();
  const itemCount = await prisma.itemTemplate.count();
  console.log(`Seeded ${categoryCount} categories and ${itemCount} catalog items.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
