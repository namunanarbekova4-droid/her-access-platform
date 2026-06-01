import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, nickname: true, isAdmin: true } },
      likes: { select: { userId: true } },
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { title?: string; content: string; imageUrl?: string };

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const post = await prisma.newsPost.create({
    data: {
      title: body.title?.trim() || null,
      content: body.content.trim(),
      imageUrl: body.imageUrl?.trim() || null,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, nickname: true, isAdmin: true } },
      likes: { select: { userId: true } },
    },
  });

  return NextResponse.json({ post });
}
