import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { checklistTaskCreateSchema } from "@/lib/schemas/checklist";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const item = await prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId: deal.id, itemKey: key } },
  });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const body = await request.json();
  const parsed = checklistTaskCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid task", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const existingCount = await prisma.checklistTask.count({ where: { itemId: item.id } });
  const { dueDate, ...rest } = parsed.data;
  const task = await prisma.checklistTask.create({
    data: {
      itemId: item.id,
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : null,
      order: existingCount,
    },
  });

  await prisma.integrationItem.update({
    where: { id: item.id },
    data: { status: item.status === "NOT_STARTED" ? "IN_PROGRESS" : item.status },
  });

  return NextResponse.json({ task }, { status: 201 });
}
