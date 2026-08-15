-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dealType" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "dealThesis" TEXT NOT NULL,
    "shortTermGoals" TEXT NOT NULL,
    "longTermGoals" TEXT NOT NULL,
    "currentStateDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "revenue" TEXT,
    "employeeCount" INTEGER,
    "industry" TEXT,
    "description" TEXT,
    "headquarters" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItOrgNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "parentId" TEXT,
    "title" TEXT NOT NULL,
    "name" TEXT,
    "function" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ItOrgNode_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItOrgNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItOrgNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntegrationCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ItemTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "renderKind" TEXT NOT NULL,
    "linkedEntity" TEXT,
    "order" INTEGER NOT NULL,
    CONSTRAINT "ItemTemplate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IntegrationCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntegrationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "ragStatus" TEXT NOT NULL DEFAULT 'GREEN',
    "owner" TEXT,
    "dueDate" DATETIME,
    "phase" TEXT,
    "content" JSONB,
    "generatedAt" DATETIME,
    "lastEditedAt" DATETIME,
    "promptVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IntegrationItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "IntegrationItem_itemKey_fkey" FOREIGN KEY ("itemKey") REFERENCES "ItemTemplate" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemVersion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "IntegrationItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "owner" TEXT,
    "dueDate" DATETIME,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChecklistTask_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "IntegrationItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssetInventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT,
    "businessUnit" TEXT,
    "users" INTEGER,
    "annualCost" REAL,
    "criticality" TEXT,
    "overlapWithOtherCompany" TEXT,
    "equivalentAsset" TEXT,
    "dataSensitivity" TEXT,
    "contractEndDate" DATETIME,
    "companySource" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssetInventoryItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RationalizationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "assetInventoryItemId" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "rationale" TEXT,
    "estimatedSynergyImpact" REAL,
    "estimatedOneTimeCost" REAL,
    "targetDate" DATETIME,
    "confidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RationalizationItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RationalizationItem_assetInventoryItemId_fkey" FOREIGN KEY ("assetInventoryItemId") REFERENCES "AssetInventoryItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT,
    "phase" TEXT NOT NULL,
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "ragStatus" TEXT NOT NULL DEFAULT 'GREEN',
    "owner" TEXT,
    "dependsOnId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Milestone_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Milestone_dependsOnId_fkey" FOREIGN KEY ("dependsOnId") REFERENCES "Milestone" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BudgetLineItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedCost" REAL NOT NULL,
    "actualCost" REAL,
    "costType" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "phase" TEXT,
    "relatedSynergyItemId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetLineItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BudgetLineItem_relatedSynergyItemId_fkey" FOREIGN KEY ("relatedSynergyItemId") REFERENCES "SynergyItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SynergyItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "annualValue" REAL,
    "oneTimeCostToAchieve" REAL,
    "realizationYear" INTEGER,
    "validationStatus" TEXT NOT NULL DEFAULT 'NOT_VALIDATED',
    "confidenceLevel" TEXT,
    "rationale" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SynergyItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TsaRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "provider" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "monthlyCost" REAL,
    "exitCriteria" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TsaRequirement_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContractLicenseItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "contractName" TEXT NOT NULL,
    "changeOfControlClause" BOOLEAN NOT NULL DEFAULT false,
    "consentRequired" BOOLEAN NOT NULL DEFAULT false,
    "consentStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED',
    "renewalDate" DATETIME,
    "annualCost" REAL,
    "overlapFlag" BOOLEAN NOT NULL DEFAULT false,
    "rationalizationAction" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContractLicenseItem_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaciEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "responsible" TEXT,
    "accountable" TEXT,
    "consulted" TEXT,
    "informed" TEXT,
    "stakeholderGroup" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaciEntry_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaidLogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner" TEXT,
    "impact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "mitigation" TEXT,
    "dateRaised" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidLogEntry_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RunbookStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "runbookName" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "owner" TEXT,
    "rollbackPlan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RunbookStep_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Company_dealId_idx" ON "Company"("dealId");

-- CreateIndex
CREATE INDEX "ItOrgNode_dealId_idx" ON "ItOrgNode"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationCategory_slug_key" ON "IntegrationCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ItemTemplate_key_key" ON "ItemTemplate"("key");

-- CreateIndex
CREATE INDEX "IntegrationItem_dealId_idx" ON "IntegrationItem"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationItem_dealId_itemKey_key" ON "IntegrationItem"("dealId", "itemKey");

-- CreateIndex
CREATE INDEX "ItemVersion_itemId_idx" ON "ItemVersion"("itemId");

-- CreateIndex
CREATE INDEX "ChecklistTask_itemId_idx" ON "ChecklistTask"("itemId");

-- CreateIndex
CREATE INDEX "AssetInventoryItem_dealId_idx" ON "AssetInventoryItem"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "RationalizationItem_assetInventoryItemId_key" ON "RationalizationItem"("assetInventoryItemId");

-- CreateIndex
CREATE INDEX "RationalizationItem_dealId_idx" ON "RationalizationItem"("dealId");

-- CreateIndex
CREATE INDEX "Milestone_dealId_idx" ON "Milestone"("dealId");

-- CreateIndex
CREATE INDEX "BudgetLineItem_dealId_idx" ON "BudgetLineItem"("dealId");

-- CreateIndex
CREATE INDEX "SynergyItem_dealId_idx" ON "SynergyItem"("dealId");

-- CreateIndex
CREATE INDEX "TsaRequirement_dealId_idx" ON "TsaRequirement"("dealId");

-- CreateIndex
CREATE INDEX "ContractLicenseItem_dealId_idx" ON "ContractLicenseItem"("dealId");

-- CreateIndex
CREATE INDEX "RaciEntry_dealId_idx" ON "RaciEntry"("dealId");

-- CreateIndex
CREATE INDEX "RaidLogEntry_dealId_idx" ON "RaidLogEntry"("dealId");

-- CreateIndex
CREATE INDEX "RunbookStep_dealId_idx" ON "RunbookStep"("dealId");
