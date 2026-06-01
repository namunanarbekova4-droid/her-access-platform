import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const courses = await prisma.course.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      _count: { select: { materials: true, lessons: true } },
    },
  });

  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    title: string;
    description: string;
    category: string;
    totalWeeks: number;
    difficulty?: string;
    language?: string;
    imageEmoji?: string;
    isPublished?: boolean;
    sortOrder?: number;
  };

  if (!body.title || !body.category || !body.totalWeeks) {
    return NextResponse.json({ error: "title, category, totalWeeks required" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      title: body.title,
      description: body.description ?? "",
      category: body.category,
      totalWeeks: Number(body.totalWeeks),
      difficulty: body.difficulty ?? "Beginner",
      language: body.language ?? "en",
      imageEmoji: body.imageEmoji ?? "📚",
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json({ course }, { status: 201 });
}
