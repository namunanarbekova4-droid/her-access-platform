import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { generateWeeklyChallenge } from "@/lib/gemini";

export const dynamic = "force-dynamic";

function genId() {
  return "wc" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS "WeeklyChallenge" (
      id TEXT PRIMARY KEY,
      "circleId" TEXT NOT NULL,
      content TEXT NOT NULL,
      "generatedAt" TIMESTAMP NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      "winnerPostId" TEXT
    )
  `.catch(() => null);

  const now = new Date();

  // Check for active (non-expired) challenge
  const existingRows = await sql`
    SELECT * FROM "WeeklyChallenge"
    WHERE "circleId" = ${params.id} AND "expiresAt" > ${now.toISOString()}::timestamp
    ORDER BY "generatedAt" DESC LIMIT 1
  `.catch(() => []);

  if (existingRows[0]) {
    return NextResponse.json({ challenge: existingRows[0] });
  }

  // Generate new challenge via Gemini
  const circleRows = await sql`
    SELECT name, COALESCE(topic, 'general') AS topic FROM "Circle" WHERE id = ${params.id} LIMIT 1
  `.catch(() => []);

  if (!circleRows[0]) {
    return NextResponse.json({ challenge: null });
  }

  const userLanguage = (session.user as { language?: string })?.language ?? "en";

  try {
    const content = await generateWeeklyChallenge(
      circleRows[0].name as string,
      circleRows[0].topic as string,
      userLanguage
    );

    const id = genId();
    const generatedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await sql`
      INSERT INTO "WeeklyChallenge" (id, "circleId", content, "generatedAt", "expiresAt")
      VALUES (${id}, ${params.id}, ${content}, ${generatedAt}::timestamp, ${expiresAt}::timestamp)
    `.catch(() => null);

    return NextResponse.json({
      challenge: { id, circleId: params.id, content, generatedAt, expiresAt, winnerPostId: null },
    });
  } catch {
    return NextResponse.json({ challenge: null });
  }
}
