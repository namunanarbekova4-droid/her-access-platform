import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const ALLOWED_EMOJIS = new Set(["🌸", "💜", "🔥", "🙌", "💡", "🤗"]);

function genId() {
  return "cr" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(
  request: NextRequest
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { postId: string; emoji: string };
  const { postId, emoji } = body;

  if (!postId || !emoji || !ALLOWED_EMOJIS.has(emoji)) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS "CircleReaction" (
      id TEXT PRIMARY KEY,
      "postId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      emoji TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL,
      UNIQUE("postId", "userId", emoji)
    )
  `.catch(() => null);

  // Toggle: remove if exists, add if not
  const existing = await sql`
    SELECT id FROM "CircleReaction"
    WHERE "postId" = ${postId} AND "userId" = ${session.user.id} AND emoji = ${emoji}
    LIMIT 1
  `.catch(() => []);

  if (existing[0]) {
    await sql`DELETE FROM "CircleReaction" WHERE id = ${existing[0].id as string}`;
    return NextResponse.json({ action: "removed", emoji });
  }

  await sql`
    INSERT INTO "CircleReaction" (id, "postId", "userId", emoji, "createdAt")
    VALUES (${genId()}, ${postId}, ${session.user.id}, ${emoji}, ${new Date().toISOString()}::timestamp)
  `;

  return NextResponse.json({ action: "added", emoji });
}
