import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateLearningPath } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { parseJsonSafe } from "@/lib/utils";
import type { LearningPath } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.learningPath) {
      const path = parseJsonSafe<LearningPath>(profile.learningPath, {
        title: "",
        description: "",
        totalWeeks: 0,
        milestones: [],
        weeklySchedule: {},
      });
      return NextResponse.json({ path });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    const rawPath = await generateLearningPath({
      goals: profile.learningGoals ?? "general education",
      educationLevel: profile.educationLevel ?? "secondary",
      timeAvailable: profile.timeAvailable ?? "1hour",
      interests: profile.interests ?? "various topics",
      language: user?.language ?? "en",
    });

    const path = parseJsonSafe<LearningPath>(rawPath, {
      title: "Your Personalized Learning Journey",
      description: "A 12-week roadmap tailored for you.",
      totalWeeks: 12,
      milestones: [],
      weeklySchedule: {},
    });

    await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: { learningPath: JSON.stringify(path) },
    });

    return NextResponse.json({ path });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Failed to generate learning path" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: { learningPath: null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset path" }, { status: 500 });
  }
}
