import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await prisma.libraryItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    title: string;
    description: string;
    category: string;
    content: string;
    language?: string;
    duration?: string;
    difficulty?: string;
  };

  if (!body.title?.trim() || !body.category?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Title, category and content are required" }, { status: 400 });
  }

  const item = await prisma.libraryItem.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      category: body.category.trim(),
      content: body.content.trim(),
      language: body.language ?? "en",
      duration: body.duration?.trim() ?? null,
      difficulty: body.difficulty?.trim() ?? null,
    },
  });

  return NextResponse.json({ item });
}
