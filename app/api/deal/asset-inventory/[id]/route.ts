import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { assetInventoryItemUpdateSchema } from "@/lib/schemas/asset-inventory";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const existing = await prisma.assetInventoryItem.findUnique({ where: { id } });
  if (!existing || existing.dealId !== deal.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = assetInventoryItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid asset inventory row", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { contractEndDate, ...rest } = parsed.data;
  const item = await prisma.assetInventoryItem.update({
    where: { id },
    data: {
      ...rest,
      ...(contractEndDate !== undefined
        ? { contractEndDate: contractEndDate ? new Date(contractEndDate) : null }
        : {}),
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const existing = await prisma.assetInventoryItem.findUnique({ where: { id } });
  if (!existing || existing.dealId !== deal.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.assetInventoryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
