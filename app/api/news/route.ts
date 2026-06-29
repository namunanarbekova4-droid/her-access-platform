import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "np" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTables() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "NewsPost" (
      id           TEXT PRIMARY KEY,
      title        TEXT,
      content      TEXT NOT NULL,
      "imageUrl"   TEXT,
      "authorId"   TEXT NOT NULL,
      "likesCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "PostLike" (
      id          TEXT PRIMARY KEY,
      "userId"    TEXT NOT NULL,
      "postId"    TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE ("userId", "postId")
    )
  `;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);

    const posts = await sql`
      SELECT
        p.id, p.title, p.content, p."imageUrl", p."authorId",
        p."likesCount", p."createdAt", p."updatedAt",
        u.name AS "authorName", u.nickname AS "authorNickname", u."isAdmin" AS "authorIsAdmin"
      FROM "NewsPost" p
      LEFT JOIN "User" u ON u.id = p."authorId"
      ORDER BY p."createdAt" DESC
    `;

    const likes = posts.length > 0
      ? await sql`SELECT "userId", "postId" FROM "PostLike" WHERE "postId" = ANY(${posts.map((p) => p.id as string)})`
      : [];

    const likesByPost: Record<string, string[]> = {};
    for (const like of likes) {
      const pid = like.postId as string;
      if (!likesByPost[pid]) likesByPost[pid] = [];
      likesByPost[pid].push(like.userId as string);
    }

    const shaped = posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      authorId: p.authorId,
      likesCount: p.likesCount,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      author: { id: p.authorId, name: p.authorName, nickname: p.authorNickname, isAdmin: p.authorIsAdmin },
      likes: (likesByPost[p.id as string] ?? []).map((uid) => ({ userId: uid })),
    }));

    return NextResponse.json({ posts: shaped });
  } catch (err) {
    console.error("[news GET]", err);
    return NextResponse.json({ posts: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { title?: string; content: string; imageUrl?: string };
  if (!body.content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);
    const id = genId();
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "NewsPost" (id, title, content, "imageUrl", "authorId", "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${body.title?.trim() ?? null},
        ${body.content.trim()},
        ${body.imageUrl?.trim() ?? null},
        ${session.user.id},
        ${now}::timestamp,
        ${now}::timestamp
      )
    `;

    const post = {
      id, title: body.title ?? null, content: body.content.trim(),
      imageUrl: body.imageUrl ?? null, authorId: session.user.id,
      likesCount: 0, createdAt: now, updatedAt: now,
      author: { id: session.user.id, name: session.user.name, nickname: null, isAdmin: true },
      likes: [],
    };
    return NextResponse.json({ post });
  } catch (err) {
    console.error("[news POST]", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
