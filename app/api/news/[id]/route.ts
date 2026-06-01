import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { title?: string; content?: string; imageUrl?: string };

  const post = await prisma.newsPost.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title?.trim() || null }),
      ...(body.content && { content: body.content.trim() }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl?.trim() || null }),
    },
    include: {
      author: { select: { id: true, name: true, nickname: true, isAdmin: true } },
      likes: { select: { userId: true } },
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.newsPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
