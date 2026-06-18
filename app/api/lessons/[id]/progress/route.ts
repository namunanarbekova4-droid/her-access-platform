import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "lp" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTable() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "LessonProgress" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "lessonId" TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      "completedAt" TIMESTAMP,
      UNIQUE("userId", "lessonId")
    )
  `.catch(() => null);
  return sql;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = await ensureTable();

  const rows = await sql`
    SELECT completed, "completedAt"
    FROM "LessonProgress"
    WHERE "userId" = ${session.user.id} AND "lessonId" = ${params.id}
    LIMIT 1
  `.catch(() => []);

  return NextResponse.json({
    completed: (rows[0]?.completed as boolean) ?? false,
    completedAt: rows[0]?.completedAt ?? null,
  });
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = await ensureTable();
  const now = new Date().toISOString();

  const rows = await sql`
    SELECT id, completed FROM "LessonProgress"
    WHERE "userId" = ${session.user.id} AND "lessonId" = ${params.id}
    LIMIT 1
  `.catch(() => []);

  if (rows[0]) {
    const newCompleted = !(rows[0].completed as boolean);
    if (newCompleted) {
      await sql`
        UPDATE "LessonProgress"
        SET completed = true, "completedAt" = ${now}::timestamp
        WHERE id = ${rows[0].id as string}
      `.catch(() => null);
    } else {
      await sql`
        UPDATE "LessonProgress"
        SET completed = false, "completedAt" = NULL
        WHERE id = ${rows[0].id as string}
      `.catch(() => null);
    }
    return NextResponse.json({ completed: newCompleted });
  }

  await sql`
    INSERT INTO "LessonProgress" (id, "userId", "lessonId", completed, "completedAt")
    VALUES (${genId()}, ${session.user.id}, ${params.id}, true, ${now}::timestamp)
  `.catch(() => null);

  return NextResponse.json({ completed: true });
}
