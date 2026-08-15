import ExcelJS from "exceljs";
import type { AssetInventoryItem } from "@/generated/prisma/client";
import {
  ASSET_TYPE_LABELS,
  CRITICALITY_LABELS,
  DATA_SENSITIVITY_LABELS,
  COMPANY_ROLE_LABELS,
} from "@/lib/labels";

const CRITICALITY_FILL: Record<string, string> = {
  CRITICAL: "FFF8D7DA",
  HIGH: "FFFCE8CD",
  MEDIUM: "FFFFF3CD",
  LOW: "FFD1E7DD",
};

export async function buildAssetInventoryXlsx(items: AssetInventoryItem[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Application & Infrastructure Inventory");

  sheet.columns = [
    { header: "Name", key: "name", width: 28 },
    { header: "Asset Type", key: "assetType", width: 16 },
    { header: "Company", key: "companySource", width: 12 },
    { header: "Owner", key: "owner", width: 20 },
    { header: "Business Unit", key: "businessUnit", width: 18 },
    { header: "Users", key: "users", width: 10 },
    { header: "Annual Cost", key: "annualCost", width: 14 },
    { header: "Criticality", key: "criticality", width: 12 },
    { header: "Data Sensitivity", key: "dataSensitivity", width: 16 },
    { header: "Contract End Date", key: "contractEndDate", width: 16 },
    { header: "Notes", key: "notes", width: 40 },
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE9ECEF" },
  };
  sheet.autoFilter = { from: "A1", to: "K1" };

  for (const item of items) {
    const row = sheet.addRow({
      name: item.name,
      assetType: ASSET_TYPE_LABELS[item.assetType] ?? item.assetType,
      companySource: COMPANY_ROLE_LABELS[item.companySource] ?? item.companySource,
      owner: item.owner ?? "",
      businessUnit: item.businessUnit ?? "",
      users: item.users ?? "",
      annualCost: item.annualCost ?? "",
      criticality: item.criticality ? CRITICALITY_LABELS[item.criticality] : "",
      dataSensitivity: item.dataSensitivity ? DATA_SENSITIVITY_LABELS[item.dataSensitivity] : "",
      contractEndDate: item.contractEndDate ? item.contractEndDate.toISOString().slice(0, 10) : "",
      notes: item.notes ?? "",
    });

    if (item.criticality && CRITICALITY_FILL[item.criticality]) {
      row.getCell("criticality").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: CRITICALITY_FILL[item.criticality] },
      };
    }
    row.getCell("annualCost").numFmt = "#,##0";
  }

  const written = await workbook.xlsx.writeBuffer();
  return Buffer.from(written as unknown as ArrayBuffer);
}
