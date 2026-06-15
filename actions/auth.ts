"use server";

import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { LANGUAGES } from "@/lib/utils";

interface RegisterData {
  name: string;
  nickname?: string;
  email: string;
  password: string;
  language: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

function generateId(): string {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  const validLanguages = LANGUAGES.map((l) => l.code);
  if (!validLanguages.includes(data.language as (typeof validLanguages)[number])) {
    return { success: false, error: "Invalid language selection." };
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const email = data.email.toLowerCase().trim();

    // HTTP query — no TCP connection, no cold-start timeout
    const existing = await sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const id = generateId();
    const name = data.name.trim();
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "User" (
        id, name, nickname, email, "emailVerified", image,
        password, language, "onboardingDone", "isAdmin",
        "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${name}, NULL, ${email}, NULL, NULL,
        ${hashedPassword}, ${data.language}, false, false,
        ${now}::timestamp, ${now}::timestamp
      )
    `;

    return { success: true };
  } catch (err) {
    console.error("[registerUser] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("Unique")) {
      return { success: false, error: "An account with this email already exists." };
    }
    return { success: false, error: `Registration failed: ${msg.slice(0, 120)}` };
  }
}

interface OnboardingData {
  userId: string;
  educationLevel: string;
  learningGoals: string;
  timeAvailable: string;
  careerDream: string;
  interests: string;
}

export async function saveOnboarding(data: OnboardingData): Promise<RegisterResult> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const now = new Date().toISOString();
    const profileId = generateId();

    await sql`
      INSERT INTO "UserProfile" (id, "userId", "educationLevel", "learningGoals", "timeAvailable", "careerDream", interests, "createdAt", "updatedAt")
      VALUES (${profileId}, ${data.userId}, ${data.educationLevel}, ${data.learningGoals}, ${data.timeAvailable}, ${data.careerDream}, ${data.interests}, ${now}::timestamp, ${now}::timestamp)
      ON CONFLICT ("userId") DO UPDATE SET
        "educationLevel" = EXCLUDED."educationLevel",
        "learningGoals" = EXCLUDED."learningGoals",
        "timeAvailable" = EXCLUDED."timeAvailable",
        "careerDream" = EXCLUDED."careerDream",
        interests = EXCLUDED.interests,
        "updatedAt" = EXCLUDED."updatedAt"
    `;

    await sql`
      UPDATE "User" SET "onboardingDone" = true, "updatedAt" = ${now}::timestamp
      WHERE id = ${data.userId}
    `;

    return { success: true };
  } catch (err) {
    console.error("[saveOnboarding] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Failed to save your profile: ${msg.slice(0, 120)}` };
  }
}
