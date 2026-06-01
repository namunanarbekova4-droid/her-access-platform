import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const videos = await prisma.videoLesson.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ videos });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    title: string;
    description?: string;
    category: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    language?: string;
    isPublished?: boolean;
    sortOrder?: number;
  };

  if (!body.title?.trim() || !body.videoUrl?.trim() || !body.category?.trim()) {
    return NextResponse.json({ error: "Title, video URL and category are required" }, { status: 400 });
  }

  const video = await prisma.videoLesson.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() ?? null,
      category: body.category.trim(),
      videoUrl: body.videoUrl.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim() ?? null,
      duration: body.duration?.trim() ?? null,
      language: body.language ?? "en",
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ video });
}
