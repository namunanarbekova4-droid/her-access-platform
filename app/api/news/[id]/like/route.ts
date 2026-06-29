import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "pl" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const postId = params.id;
    const userId = session.user.id;

    const existing = await sql`
      SELECT id FROM "PostLike" WHERE "userId" = ${userId} AND "postId" = ${postId} LIMIT 1
    `;

    if (existing[0]) {
      await sql`DELETE FROM "PostLike" WHERE id = ${existing[0].id as string}`;
      await sql`UPDATE "NewsPost" SET "likesCount" = GREATEST("likesCount" - 1, 0) WHERE id = ${postId}`;
      return NextResponse.json({ liked: false });
    } else {
      const id = genId();
      const now = new Date().toISOString();
      await sql`
        INSERT INTO "PostLike" (id, "userId", "postId", "createdAt")
        VALUES (${id}, ${userId}, ${postId}, ${now}::timestamp)
        ON CONFLICT ("userId", "postId") DO NOTHING
      `;
      await sql`UPDATE "NewsPost" SET "likesCount" = "likesCount" + 1 WHERE id = ${postId}`;
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    console.error("[news like]", err);
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}
