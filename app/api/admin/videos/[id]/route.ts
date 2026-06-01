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
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    language: string;
    isPublished: boolean;
    sortOrder: number;
  }>;

  const video = await prisma.videoLesson.update({
    where: { id: params.id },
    data: {
      ...(body.title && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description?.trim() ?? null }),
      ...(body.category && { category: body.category.trim() }),
      ...(body.videoUrl && { videoUrl: body.videoUrl.trim() }),
      ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl?.trim() ?? null }),
      ...(body.duration !== undefined && { duration: body.duration?.trim() ?? null }),
      ...(body.language && { language: body.language }),
      ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json({ video });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.videoLesson.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
