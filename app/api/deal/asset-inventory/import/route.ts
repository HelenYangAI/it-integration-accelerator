import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { assetInventoryImportCommitSchema } from "@/lib/schemas/asset-inventory";

const ASSET_TYPES = ["APP", "SERVER", "DATACENTER", "CLOUD_SERVICE", "NETWORK"] as const;
const CRITICALITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const DATA_SENSITIVITY = ["LOW", "MEDIUM", "HIGH", "RESTRICTED"] as const;

function normalizeEnum<T extends readonly string[]>(value: string | undefined, options: T): T[number] | null {
  if (!value) return null;
  const key = value.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return (options as readonly string[]).includes(key) ? (key as T[number]) : null;
}

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const body = await request.json();
  const parsed = assetInventoryImportCommitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid import payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { rows, mapping, companySource } = parsed.data;

  const field = (row: Record<string, string>, key: string): string | undefined => {
    const header = mapping[key];
    if (!header) return undefined;
    return row[header];
  };

  const toCreate = rows
    .map((row) => {
      const name = field(row, "name")?.trim();
      if (!name) return null;
      return {
        dealId: deal.id,
        name,
        assetType: normalizeEnum(field(row, "assetType"), ASSET_TYPES) ?? "APP",
        owner: field(row, "owner")?.trim() || null,
        businessUnit: field(row, "businessUnit")?.trim() || null,
        users: (() => {
          const n = toNumber(field(row, "users"));
          return n === null ? null : Math.round(n);
        })(),
        annualCost: toNumber(field(row, "annualCost")),
        criticality: normalizeEnum(field(row, "criticality"), CRITICALITY),
        dataSensitivity: normalizeEnum(field(row, "dataSensitivity"), DATA_SENSITIVITY),
        contractEndDate: toDate(field(row, "contractEndDate")),
        notes: field(row, "notes")?.trim() || null,
        companySource,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (toCreate.length === 0) {
    return NextResponse.json(
      { error: "No rows had a mapped, non-empty name column — check your column mapping" },
      { status: 400 }
    );
  }

  await prisma.assetInventoryItem.createMany({ data: toCreate });

  const item = await prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId: deal.id, itemKey: "app-infra-inventory" } },
  });
  if (item) {
    await prisma.integrationItem.update({
      where: { id: item.id },
      data: { status: item.status === "NOT_STARTED" ? "IN_PROGRESS" : item.status },
    });
  }

  return NextResponse.json({
    createdCount: toCreate.length,
    skippedCount: rows.length - toCreate.length,
  });
}
