import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { generateAnonymousNickname } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DEFAULT_CIRCLES = [
  { name: "English Learners",  emoji: "🌍", topic: "english", description: "Practice speaking and writing English together in a safe space." },
  { name: "Digital Skills",    emoji: "💻", topic: "coding",  description: "Learn technology, internet tools, and digital literacy step by step." },
  { name: "Career & Jobs",     emoji: "💼", topic: "career",  description: "Discuss freelancing, jobs, CVs, and growing professionally." },
  { name: "Mental Support",    emoji: "💜", topic: "health",  description: "A safe, judgment-free space for emotional support and encouragement." },
  { name: "Study Together",    emoji: "📚", topic: "study",   description: "Study sessions, exam prep, and accountability partners." },
  { name: "Financial Freedom", emoji: "💰", topic: "finance", description: "Budgeting, saving, money management, and financial independence." },
];

function genId(prefix = "ci") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Creates all Circle-related tables if they don't exist yet.
// This makes the route self-healing regardless of whether Prisma migrations ran.
async function ensureTables() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "Circle" (
      id           TEXT        PRIMARY KEY,
      name         TEXT        NOT NULL,
      description  TEXT,
      topic        TEXT        NOT NULL DEFAULT 'general',
      emoji        TEXT        NOT NULL DEFAULT '💬',
      "maxMembers" INT         NOT NULL DEFAULT 5,
      "createdAt"  TIMESTAMP   NOT NULL DEFAULT NOW()
    )
  `.catch((err: unknown) => {
    console.error("[PeerCircles] Failed to create Circle table:", err);
  });

  await sql`
    CREATE TABLE IF NOT EXISTS "CircleMember" (
      id         TEXT      PRIMARY KEY,
      "circleId" TEXT      NOT NULL,
      "userId"   TEXT      NOT NULL,
      nickname   TEXT      NOT NULL,
      "joinedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE ("circleId", "userId")
    )
  `.catch((err: unknown) => {
    console.error("[PeerCircles] Failed to create CircleMember table:", err);
  });

  // Add emoji column to existing Circle tables that predate this migration
  await sql`
    ALTER TABLE "Circle" ADD COLUMN IF NOT EXISTS emoji TEXT NOT NULL DEFAULT '💬'
  `.catch(() => null); // safe to ignore — column already exists
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureTables();
  const sql = neon(process.env.DATABASE_URL!);

  let circleRows = await sql`
    SELECT * FROM "Circle" ORDER BY "createdAt" ASC
  `.catch((err: unknown) => {
    console.error("[PeerCircles] Failed to query Circle table:", err);
    return [];
  });

  console.log(`[PeerCircles] Circle count: ${circleRows.length}`);

  // Auto-seed 6 default circles if table is empty
  if (circleRows.length === 0) {
    console.log("[PeerCircles] Creating default circles…");
    const now = new Date().toISOString();
    let created = 0;

    for (const c of DEFAULT_CIRCLES) {
      try {
        await sql`
          INSERT INTO "Circle" (id, name, topic, emoji, description, "maxMembers", "createdAt")
          VALUES (${genId()}, ${c.name}, ${c.topic}, ${c.emoji}, ${c.description}, 5, ${now}::timestamp)
          ON CONFLICT DO NOTHING
        `;
        created++;
      } catch (err) {
        console.error(`[PeerCircles] Failed to insert circle "${c.name}":`, err);
      }
    }

    console.log(`[PeerCircles] Created ${created} circles`);

    circleRows = await sql`
      SELECT * FROM "Circle" ORDER BY "createdAt" ASC
    `.catch((err: unknown) => {
      console.error("[PeerCircles] Failed to re-query after seed:", err);
      return [];
    });
  } else {
    // Backfill emoji for circles that predate the emoji column
    for (const def of DEFAULT_CIRCLES) {
      await sql`
        UPDATE "Circle" SET emoji = ${def.emoji}
        WHERE name = ${def.name} AND (emoji IS NULL OR emoji = '💬')
      `.catch(() => null);
    }
    circleRows = await sql`SELECT * FROM "Circle" ORDER BY "createdAt" ASC`.catch(() => []);
  }

  console.log(`[PeerCircles] Returning ${circleRows.length} circles`);

  if (circleRows.length === 0) {
    return NextResponse.json({ circles: [] });
  }

  const circleIds = circleRows.map((c) => c.id as string);

  const [memberCountRows, userMemberRows] = await Promise.all([
    sql`
      SELECT "circleId", COUNT(*)::int AS count
      FROM "CircleMember"
      WHERE "circleId" = ANY(${circleIds})
      GROUP BY "circleId"
    `.catch(() => []),
    sql`
      SELECT "circleId", id, nickname
      FROM "CircleMember"
      WHERE "circleId" = ANY(${circleIds}) AND "userId" = ${session.user.id}
    `.catch(() => []),
  ]);

  const countMap: Record<string, number> = {};
  for (const r of memberCountRows) countMap[r.circleId as string] = r.count as number;

  const memberMap: Record<string, { id: string; nickname: string }> = {};
  for (const r of userMemberRows) memberMap[r.circleId as string] = { id: r.id as string, nickname: r.nickname as string };

  const circles = circleRows.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    topic: c.topic,
    emoji: (c.emoji as string) || "💬",
    maxMembers: c.maxMembers,
    _count: { members: countMap[c.id as string] ?? 0 },
    members: memberMap[c.id as string] ? [memberMap[c.id as string]] : [],
  }));

  return NextResponse.json({ circles });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { circleId: string };
  const { circleId } = body;
  if (!circleId) return NextResponse.json({ error: "Missing circleId" }, { status: 400 });

  const sql = neon(process.env.DATABASE_URL!);

  const circleRows = await sql`SELECT * FROM "Circle" WHERE id = ${circleId} LIMIT 1`.catch(() => []);
  if (!circleRows[0]) return NextResponse.json({ error: "Circle not found" }, { status: 404 });

  const circle = circleRows[0];
  const countRows = await sql`
    SELECT COUNT(*)::int AS count FROM "CircleMember" WHERE "circleId" = ${circleId}
  `.catch(() => [{ count: 0 }]);
  if ((countRows[0]?.count ?? 0) >= (circle.maxMembers as number)) {
    return NextResponse.json({ error: "Circle is full" }, { status: 400 });
  }

  const existingRows = await sql`
    SELECT id FROM "CircleMember"
    WHERE "circleId" = ${circleId} AND "userId" = ${session.user.id}
    LIMIT 1
  `.catch(() => []);
  if (existingRows[0]) {
    return NextResponse.json({ error: "Already a member" }, { status: 400 });
  }

  const nickname = generateAnonymousNickname();
  const memberId = genId("cm");
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "CircleMember" (id, "circleId", "userId", nickname, "joinedAt")
    VALUES (${memberId}, ${circleId}, ${session.user.id}, ${nickname}, ${now}::timestamp)
  `;

  return NextResponse.json({ member: { id: memberId, nickname } });
}
