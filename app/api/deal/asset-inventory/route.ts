import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveDeal } from "@/lib/deal";
import { assetInventoryItemSchema } from "@/lib/schemas/asset-inventory";

export async function GET() {
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const items = await prisma.assetInventoryItem.findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const deal = await getActiveDeal();
  if (!deal) return NextResponse.json({ error: "No active deal" }, { status: 404 });

  const body = await request.json();
  const parsed = assetInventoryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid asset inventory row", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { contractEndDate, ...rest } = parsed.data;
  const item = await prisma.assetInventoryItem.create({
    data: {
      dealId: deal.id,
      ...rest,
      contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
    },
  });
  return NextResponse.json({ item }, { status: 201 });
}
