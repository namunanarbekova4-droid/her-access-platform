import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as Record<string, unknown>;

  const course = await prisma.course.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title as string }),
      ...(body.description !== undefined && { description: body.description as string }),
      ...(body.category !== undefined && { category: body.category as string }),
      ...(body.totalWeeks !== undefined && { totalWeeks: Number(body.totalWeeks) }),
      ...(body.difficulty !== undefined && { difficulty: body.difficulty as string }),
      ...(body.language !== undefined && { language: body.language as string }),
      ...(body.imageEmoji !== undefined && { imageEmoji: body.imageEmoji as string }),
      ...(body.isPublished !== undefined && { isPublished: body.isPublished as boolean }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
    },
  });

  return NextResponse.json({ course });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.course.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
