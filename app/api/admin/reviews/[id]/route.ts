import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { status: "APPROVED" | "REJECTED" | "PENDING" };

  const review = await prisma.review.update({
    where: { id: params.id },
    data: { status: body.status },
  });

  return NextResponse.json({ review });
}
