import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "qv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS "AnonQuestionVote" (
      id TEXT PRIMARY KEY,
      "postId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL,
      UNIQUE("postId", "userId")
    )
  `.catch(() => null);

  const existing = await sql`
    SELECT id FROM "AnonQuestionVote"
    WHERE "postId" = ${params.questionId} AND "userId" = ${session.user.id}
    LIMIT 1
  `.catch(() => []);

  if (existing[0]) {
    await sql`DELETE FROM "AnonQuestionVote" WHERE id = ${existing[0].id as string}`;
    return NextResponse.json({ action: "removed" });
  }

  await sql`
    INSERT INTO "AnonQuestionVote" (id, "postId", "userId", "createdAt")
    VALUES (${genId()}, ${params.questionId}, ${session.user.id}, ${new Date().toISOString()}::timestamp)
  `;

  return NextResponse.json({ action: "added" });
}
