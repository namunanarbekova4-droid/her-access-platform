import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as Partial<{
    title: string;
    description: string;
    category: string;
    content: string;
    language: string;
    duration: string;
    difficulty: string;
  }>;

  const item = await prisma.libraryItem.update({
    where: { id: params.id },
    data: {
      ...(body.title && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description?.trim() ?? "" }),
      ...(body.category && { category: body.category.trim() }),
      ...(body.content && { content: body.content.trim() }),
      ...(body.language && { language: body.language }),
      ...(body.duration !== undefined && { duration: body.duration?.trim() ?? null }),
      ...(body.difficulty !== undefined && { difficulty: body.difficulty?.trim() ?? null }),
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.libraryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
