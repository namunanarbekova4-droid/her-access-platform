import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, nickname: true } },
    },
  });

  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, averageRating: Math.round(avg * 10) / 10, totalCount: reviews.length });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { reviewText: string; rating: number; anonymous: boolean };

  if (!body.reviewText?.trim()) return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  if (!body.rating || body.rating < 1 || body.rating > 5) return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });

  const existing = await prisma.review.findFirst({ where: { userId: session.user.id } });
  if (existing) return NextResponse.json({ error: "You have already submitted a review" }, { status: 409 });

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      reviewText: body.reviewText.trim(),
      rating: body.rating,
      anonymous: body.anonymous ?? false,
    },
  });

  return NextResponse.json({ review });
}
