import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { getEntityConfig, toDelegateName } from "@/lib/entities/config";
import { coerceRow } from "@/lib/entities/validate";

type OwnedRow = { id: string; dealId: string };

type Delegate = {
  findUnique: (args: unknown) => Promise<OwnedRow | null>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

function getDelegate(model: string): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[toDelegateName(model)];
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await ctx.params;
  const config = getEntityConfig(entity);
  if (!config) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const delegate = getDelegate(config.model);
  const existing = await delegate.findUnique({ where: { id } });
  if (!existing || existing.dealId !== deal.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { data, errors } = coerceRow(body, config.columns, "update");
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const row = await delegate.update({ where: { id }, data });
  return NextResponse.json({ row });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await ctx.params;
  const config = getEntityConfig(entity);
  if (!config) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const delegate = getDelegate(config.model);
  const existing = await delegate.findUnique({ where: { id } });
  if (!existing || existing.dealId !== deal.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await delegate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
