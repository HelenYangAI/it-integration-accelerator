import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";

export async function POST() {
  const deal = await getActiveDeal();
  if (!deal) {
    return NextResponse.json({ error: "No active deal" }, { status: 404 });
  }

  // Every dealId relation cascades (see prisma/schema.prisma), so this
  // deletes all companies, IT org nodes, catalog item instances (and their
  // versions/tasks), and every generic-table row for the deal in one call.
  await prisma.deal.delete({ where: { id: deal.id } });

  return NextResponse.json({ ok: true });
}
