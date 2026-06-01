import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId: session.user.id, postId: params.id } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    await prisma.newsPost.update({
      where: { id: params.id },
      data: { likesCount: { decrement: 1 } },
    });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.postLike.create({
      data: { userId: session.user.id, postId: params.id },
    });
    await prisma.newsPost.update({
      where: { id: params.id },
      data: { likesCount: { increment: 1 } },
    });
    return NextResponse.json({ liked: true });
  }
}
