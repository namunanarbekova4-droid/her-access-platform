import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { generateAnonymousNickname } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DEFAULT_CIRCLES = [
  { name: "English Learners", topic: "english", description: "Practice English speaking and writing in a safe, encouraging space." },
  { name: "Digital Skills", topic: "coding", description: "Learn computers, internet, and digital tools together step by step." },
  { name: "Career & Jobs", topic: "career", description: "Share tips on finding work, interviews, and growing professionally." },
  { name: "Health & Wellbeing", topic: "health", description: "Talk openly about health, self-care, and mental wellness." },
  { name: "General Support", topic: "study", description: "A safe space to ask questions, share experiences, and lift each other up." },
];

function genId(prefix = "ci") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  let circleRows = await sql`SELECT * FROM "Circle" ORDER BY "createdAt" ASC`.catch(() => []);

  // Auto-seed default circles if table is empty
  if (circleRows.length === 0) {
    const now = new Date().toISOString();
    for (const c of DEFAULT_CIRCLES) {
      await sql`
        INSERT INTO "Circle" (id, name, topic, description, "maxMembers", "createdAt")
        VALUES (${genId()}, ${c.name}, ${c.topic}, ${c.description}, 5, ${now}::timestamp)
        ON CONFLICT DO NOTHING
      `.catch(() => null);
    }
    circleRows = await sql`SELECT * FROM "Circle" ORDER BY "createdAt" ASC`.catch(() => []);
  }

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
