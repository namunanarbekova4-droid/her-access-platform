import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateLearningPath } from "@/lib/gemini";
import { neon } from "@neondatabase/serverless";
import { parseJsonSafe } from "@/lib/utils";
import type { LearningPath } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const userId = session.user.id;

    const profileRows = await sql`
      SELECT "learningGoals", "educationLevel", "timeAvailable", interests, "learningPath"
      FROM "UserProfile" WHERE "userId" = ${userId} LIMIT 1
    `.catch(() => []);

    if (!profileRows.length) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = profileRows[0];

    if (profile.learningPath) {
      const path = parseJsonSafe<LearningPath>(profile.learningPath as string, {
        title: "",
        description: "",
        totalWeeks: 0,
        milestones: [],
        weeklySchedule: {},
      });
      return NextResponse.json({ path });
    }

    const userRows = await sql`
      SELECT language FROM "User" WHERE id = ${userId} LIMIT 1
    `.catch(() => []);
    const language = (userRows[0]?.language as string) ?? "en";

    const rawPath = await generateLearningPath({
      goals: (profile.learningGoals as string) ?? "general education",
      educationLevel: (profile.educationLevel as string) ?? "secondary",
      timeAvailable: (profile.timeAvailable as string) ?? "1hour",
      interests: (profile.interests as string) ?? "various topics",
      language,
    });

    const path = parseJsonSafe<LearningPath>(rawPath, {
      title: "Your Personalized Learning Journey",
      description: "A 12-week roadmap tailored for you.",
      totalWeeks: 12,
      milestones: [],
      weeklySchedule: {},
    });

    const now = new Date().toISOString();
    await sql`
      UPDATE "UserProfile"
      SET "learningPath" = ${JSON.stringify(path)}, "updatedAt" = ${now}::timestamp
      WHERE "userId" = ${userId}
    `.catch(() => {});

    return NextResponse.json({ path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
    }
    return NextResponse.json({ error: `Failed to generate learning path: ${message.slice(0, 100)}` }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const now = new Date().toISOString();
    await sql`
      UPDATE "UserProfile"
      SET "learningPath" = NULL, "updatedAt" = ${now}::timestamp
      WHERE "userId" = ${session.user.id}
    `;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset path" }, { status: 500 });
  }
}
