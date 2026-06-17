import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const videos = await sql`
    SELECT id, title, description, category, "videoUrl", "thumbnailUrl",
           duration, language, "sortOrder", "courseId"
    FROM "VideoLesson"
    WHERE "isPublished" = true
    ORDER BY "sortOrder" ASC, "createdAt" DESC
  `.catch(() => []);

  return NextResponse.json({ videos });
}
