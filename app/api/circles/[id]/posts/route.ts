import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.circlePost.findMany({
      where: { circleId: params.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId: params.id, userId: session.user.id } },
    });

    if (!member) {
      return NextResponse.json({ error: "Not a member of this circle" }, { status: 403 });
    }

    const body = await request.json() as { content: string };
    const { content } = body;

    if (!content?.trim() || content.trim().length < 2) {
      return NextResponse.json({ error: "Message too short" }, { status: 400 });
    }

    if (content.trim().length > 500) {
      return NextResponse.json({ error: "Message too long (max 500 chars)" }, { status: 400 });
    }

    const post = await prisma.circlePost.create({
      data: {
        circleId: params.id,
        nickname: member.nickname,
        content: content.trim(),
      },
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
