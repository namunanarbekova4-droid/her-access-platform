import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const reviews = await sql`
      SELECT
        r.id, r."userId", r."reviewText", r.rating, r.anonymous,
        r.status, r."createdAt",
        u.name AS "userName", u.nickname AS "userNickname", u.email AS "userEmail"
      FROM "Review" r
      LEFT JOIN "User" u ON u.id = r."userId"
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
      user: { name: r.userName, nickname: r.userNickname, email: r.userEmail },
    }));

    return NextResponse.json({ reviews: shaped });
  } catch (err) {
    console.error("[admin/reviews GET]", err);
    return NextResponse.json({ reviews: [] });
  }
}
