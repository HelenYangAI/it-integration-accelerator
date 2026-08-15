import { NextResponse } from "next/server";
import { createDeal, getActiveDeal } from "@/lib/deal";
import { dealIntakeSchema } from "@/lib/schemas/deal";

export async function GET() {
  const deal = await getActiveDeal();
  return NextResponse.json({ deal });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = dealIntakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid deal intake data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const dealId = await createDeal(parsed.data);
    return NextResponse.json({ dealId }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create deal";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
