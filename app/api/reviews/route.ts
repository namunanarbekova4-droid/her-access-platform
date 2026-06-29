import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "rv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTable() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "Review" (
      id           TEXT PRIMARY KEY,
      "userId"     TEXT NOT NULL,
      "reviewText" TEXT NOT NULL,
      rating       INTEGER NOT NULL,
      anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
      status       TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const sql = neon(process.env.DATABASE_URL!);

    const reviews = await sql`
      SELECT
        r.id, r."userId", r."reviewText", r.rating, r.anonymous,
        r.status, r."createdAt",
        u.name AS "userName", u.nickname AS "userNickname"
      FROM "Review" r
      LEFT JOIN "User" u ON u.id = r."userId"
      WHERE r.status = 'APPROVED'
      ORDER BY r."createdAt" DESC
    `;

    const shaped = reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      reviewText: r.reviewText,
      rating: r.rating,
      anonymous: r.anonymous,
      status: r.status,
      createdAt: r.createdAt,
      user: r.anonymous ? null : { name: r.userName, nickname: r.userNickname },
    }));

    const avg = shaped.length > 0
      ? shaped.reduce((sum, r) => sum + (r.rating as number), 0) / shaped.length
      : 0;

    return NextResponse.json({
      reviews: shaped,
      averageRating: Math.round(avg * 10) / 10,
      totalCount: shaped.length,
    });
  } catch (err) {
    console.error("[reviews GET]", err);
    return NextResponse.json({ reviews: [], averageRating: 0, totalCount: 0 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { reviewText: string; rating: number; anonymous: boolean };

  if (!body.reviewText?.trim())
    return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  if (!body.rating || body.rating < 1 || body.rating > 5)
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });

  try {
    await ensureTable();
    const sql = neon(process.env.DATABASE_URL!);

    const existing = await sql`
      SELECT id FROM "Review" WHERE "userId" = ${session.user.id} LIMIT 1
    `;
    if (existing[0]) return NextResponse.json({ error: "You have already submitted a review" }, { status: 409 });

    const id = genId();
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "Review" (id, "userId", "reviewText", rating, anonymous, "createdAt", "updatedAt")
      VALUES (
        ${id}, ${session.user.id}, ${body.reviewText.trim()},
        ${body.rating}, ${body.anonymous ?? false},
        ${now}::timestamp, ${now}::timestamp
      )
    `;

    return NextResponse.json({ review: { id, reviewText: body.reviewText.trim(), rating: body.rating } });
  } catch (err) {
    console.error("[reviews POST]", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
