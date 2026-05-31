import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAnonymousNickname } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const circles = await prisma.circle.findMany({
      include: {
        _count: { select: { members: true } },
        members: {
          where: { userId: session.user.id },
          select: { id: true, nickname: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ circles });
  } catch {
    return NextResponse.json({ error: "Failed to load circles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { circleId: string };
    const { circleId } = body;

    const circle = await prisma.circle.findUnique({
      where: { id: circleId },
      include: { _count: { select: { members: true } } },
    });

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    if (circle._count.members >= circle.maxMembers) {
      return NextResponse.json({ error: "Circle is full" }, { status: 400 });
    }

    const existing = await prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId: session.user.id } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    const nickname = generateAnonymousNickname();
    const member = await prisma.circleMember.create({
      data: { circleId, userId: session.user.id, nickname },
    });

    return NextResponse.json({ member });
  } catch {
    return NextResponse.json({ error: "Failed to join circle" }, { status: 500 });
  }
}
