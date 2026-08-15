import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { checklistTaskUpdateSchema } from "@/lib/schemas/checklist";

async function loadOwnedTask(dealId: string, itemKey: string, taskId: string) {
  const item = await prisma.integrationItem.findUnique({
    where: { dealId_itemKey: { dealId, itemKey } },
  });
  if (!item) return null;
  const task = await prisma.checklistTask.findUnique({ where: { id: taskId } });
  if (!task || task.itemId !== item.id) return null;
  return task;
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ key: string; taskId: string }> }
) {
  const { key, taskId } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const existing = await loadOwnedTask(deal.id, key, taskId);
  if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const body = await request.json();
  const parsed = checklistTaskUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid task update", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { dueDate, ...rest } = parsed.data;
  const task = await prisma.checklistTask.update({
    where: { id: taskId },
    data: {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
    },
  });
  return NextResponse.json({ task });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ key: string; taskId: string }> }
) {
  const { key, taskId } = await ctx.params;
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const existing = await loadOwnedTask(deal.id, key, taskId);
  if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  await prisma.checklistTask.delete({ where: { id: taskId } });
  return NextResponse.json({ ok: true });
}
