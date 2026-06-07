import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateLinkedInProfile } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, currentRole, yearsExperience, education, skills, achievements, goals, tone, language } = body;

  if (!name || !currentRole || !skills) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const raw = await generateLinkedInProfile({
    name,
    currentRole,
    yearsExperience: yearsExperience || "not specified",
    education: education || "not specified",
    skills,
    achievements: achievements || "not specified",
    goals: goals || "not specified",
    tone: tone || "professional",
    language: language || "en",
  });

  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const profile = JSON.parse(cleaned);

  return NextResponse.json({ profile });
}
