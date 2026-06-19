import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { moderateCircleMessage } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const REVIVAL_MESSAGES = [
  "What's one thing you're working on or excited about this week? 🌸",
  "Has anyone made progress on their goals recently? Share your wins! 💜",
  "What's something new you've learned lately? Would love to hear! 📚",
  "Sending warmth to everyone here. How are you all doing today? 💬",
  "What's one skill you'd like to get better at this month? 🌟",
];

function genId(prefix = "cp") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTables() {
  const sql = neon(process.env.DATABASE_URL!);
  await Promise.all([
    sql`
      CREATE TABLE IF NOT EXISTS "CirclePost" (
        id          TEXT      PRIMARY KEY,
        "circleId"  TEXT      NOT NULL,
        nickname    TEXT      NOT NULL,
        content     TEXT      NOT NULL,
        type        TEXT      NOT NULL DEFAULT 'message',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `.catch(() => null),
    sql`
      CREATE TABLE IF NOT EXISTS "CircleReaction" (
        id TEXT PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        emoji TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        UNIQUE("postId", "userId", emoji)
      )
    `.catch(() => null),
    sql`
      CREATE TABLE IF NOT EXISTS "AnonQuestionVote" (
        id TEXT PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        UNIQUE("postId", "userId")
      )
    `.catch(() => null),
  ]);

  // Backfill type column for tables created before this column was added
  await sql`ALTER TABLE "CirclePost" ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'message'`.catch(() => null);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  await ensureTables();

  // ── Conversation revival check ──────────────────────────────────────────────
  const recentRows = await sql`
    SELECT COALESCE(type, 'message') AS type, "createdAt"
    FROM "CirclePost"
    WHERE "circleId" = ${params.id}
    ORDER BY "createdAt" DESC LIMIT 10
  `.catch(() => []);

  if (recentRows.length > 0) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const lastNonAI = recentRows.find((r) => r.type !== "ai");
    const lastAI = recentRows.find((r) => r.type === "ai");
    const nonAIIsOld = !lastNonAI || new Date(lastNonAI.createdAt as string) < twoHoursAgo;
    const aiIsOld = !lastAI || new Date(lastAI.createdAt as string) < twoHoursAgo;

    if (nonAIIsOld && aiIsOld) {
      const content = REVIVAL_MESSAGES[Math.floor(Math.random() * REVIVAL_MESSAGES.length)]!;
      const postId = genId("ai");
      const now = new Date().toISOString();
      await sql`
        INSERT INTO "CirclePost" (id, "circleId", nickname, content, type, "createdAt")
        VALUES (${postId}, ${params.id}, 'HerAI 🌸', ${content}, 'ai', ${now}::timestamp)
      `.catch(() => null);
    }
  }

  // ── Fetch posts ──────────────────────────────────────────────────────────────
  const posts = await sql`
    SELECT id, "circleId", nickname, content, "createdAt",
      COALESCE(type, 'message') AS type
    FROM "CirclePost"
    WHERE "circleId" = ${params.id}
    ORDER BY "createdAt" ASC
    LIMIT 50
  `.catch(() => []);

  if (posts.length === 0) {
    return NextResponse.json({ posts: [], reactions: {}, myReactions: {}, questionVotes: {}, myVotes: [] });
  }

  const postIds = posts.map((p) => p.id as string);

  // ── Fetch reactions & votes in parallel ──────────────────────────────────────
  const [reactionCounts, myReactionRows, voteCounts, myVoteRows] = await Promise.all([
    sql`
      SELECT "postId", emoji, COUNT(*)::int AS count
      FROM "CircleReaction"
      WHERE "postId" = ANY(${postIds})
      GROUP BY "postId", emoji
    `.catch(() => []),
    sql`
      SELECT "postId", emoji FROM "CircleReaction"
      WHERE "postId" = ANY(${postIds}) AND "userId" = ${session.user.id}
    `.catch(() => []),
    sql`
      SELECT "postId", COUNT(*)::int AS count FROM "AnonQuestionVote"
      WHERE "postId" = ANY(${postIds})
      GROUP BY "postId"
    `.catch(() => []),
    sql`
      SELECT "postId" FROM "AnonQuestionVote"
      WHERE "postId" = ANY(${postIds}) AND "userId" = ${session.user.id}
    `.catch(() => []),
  ]);

  const reactions: Record<string, Record<string, number>> = {};
  for (const r of reactionCounts) {
    if (!reactions[r.postId as string]) reactions[r.postId as string] = {};
    reactions[r.postId as string]![r.emoji as string] = r.count as number;
  }

  const myReactions: Record<string, string[]> = {};
  for (const r of myReactionRows) {
    if (!myReactions[r.postId as string]) myReactions[r.postId as string] = [];
    myReactions[r.postId as string]!.push(r.emoji as string);
  }

  const questionVotes: Record<string, number> = {};
  for (const r of voteCounts) questionVotes[r.postId as string] = r.count as number;

  const myVotes = myVoteRows.map((r) => r.postId as string);

  return NextResponse.json({ posts, reactions, myReactions, questionVotes, myVotes });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  await ensureTables();

  const memberRows = await sql`
    SELECT id, nickname FROM "CircleMember"
    WHERE "circleId" = ${params.id} AND "userId" = ${session.user.id}
    LIMIT 1
  `.catch(() => []);

  if (!memberRows[0]) {
    return NextResponse.json({ error: "Not a member of this circle" }, { status: 403 });
  }

  const body = await request.json() as { content: string; type?: string };
  const { content, type = "message" } = body;

  // ── Anonymous question ───────────────────────────────────────────────────────
  if (type === "question") {
    if (!content?.trim() || content.trim().length < 5) {
      return NextResponse.json({ error: "Question too short (min 5 characters)" }, { status: 400 });
    }
    if (content.trim().length > 300) {
      return NextResponse.json({ error: "Question too long (max 300 characters)" }, { status: 400 });
    }
    const postId = genId("qp");
    const now = new Date().toISOString();
    await sql`
      INSERT INTO "CirclePost" (id, "circleId", nickname, content, type, "createdAt")
      VALUES (${postId}, ${params.id}, 'Anonymous ❓', ${content.trim()}, 'question', ${now}::timestamp)
    `;
    return NextResponse.json({
      post: { id: postId, circleId: params.id, nickname: "Anonymous ❓", content: content.trim(), type: "question", createdAt: now },
    });
  }

  // ── Regular message ──────────────────────────────────────────────────────────
  if (!content?.trim() || content.trim().length < 2) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "Message too long (max 500 characters)" }, { status: 400 });
  }

  const trimmed = content.trim();

  // ── AI Moderation ────────────────────────────────────────────────────────────
  const modResult = await moderateCircleMessage(trimmed);

  if (modResult.classification === "TOXIC") {
    return NextResponse.json({
      error: "This message doesn't meet our community guidelines. Please keep conversations kind and supportive.",
      code: "TOXIC",
    }, { status: 400 });
  }

  const postId = genId();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "CirclePost" (id, "circleId", nickname, content, type, "createdAt")
    VALUES (${postId}, ${params.id}, ${memberRows[0].nickname as string}, ${trimmed}, 'message', ${now}::timestamp)
  `;

  const post = { id: postId, circleId: params.id, nickname: memberRows[0].nickname, content: trimmed, type: "message", createdAt: now };

  // ── Distress response ────────────────────────────────────────────────────────
  if (modResult.classification === "DISTRESS" && modResult.response) {
    const aiId = genId("ai");
    const aiNow = new Date(Date.now() + 500).toISOString();
    await sql`
      INSERT INTO "CirclePost" (id, "circleId", nickname, content, type, "createdAt")
      VALUES (${aiId}, ${params.id}, 'HerAI 🌸', ${modResult.response}, 'ai', ${aiNow}::timestamp)
    `.catch(() => null);
  }

  return NextResponse.json({ post });
}
