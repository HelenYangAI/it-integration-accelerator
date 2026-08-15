import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { getEntityConfig, toDelegateName } from "@/lib/entities/config";
import { coerceRow } from "@/lib/entities/validate";

type Delegate = {
  findMany: (args: unknown) => Promise<unknown[]>;
  create: (args: unknown) => Promise<unknown>;
};

function getDelegate(model: string): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[toDelegateName(model)];
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ entity: string }> }
) {
  const { entity } = await ctx.params;
  const config = getEntityConfig(entity);
  if (!config) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const rows = await getDelegate(config.model).findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ rows });
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ entity: string }> }
) {
  const { entity } = await ctx.params;
  const config = getEntityConfig(entity);
  if (!config) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const body = await request.json();
  const merged = { ...config.defaultValues, ...body };
  const { data, errors } = coerceRow(merged, config.columns, "create");
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const row = await getDelegate(config.model).create({
    data: { dealId: deal.id, ...data },
  });
  return NextResponse.json({ row }, { status: 201 });
}
