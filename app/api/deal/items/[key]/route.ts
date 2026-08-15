import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { itemTrackingPatchSchema } from "@/lib/schemas/item";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) {
    return NextResponse.json({ error: "No active deal" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = itemTrackingPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid item update", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { dueDate, content, ...rest } = parsed.data;

  const item = await prisma.integrationItem.update({
    where: { dealId_itemKey: { dealId: deal.id, itemKey: key } },
    data: {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(content !== undefined ? { content, lastEditedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ item });
}
