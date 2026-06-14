"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  const validLanguages = LANGUAGES.map((l) => l.code);
  if (!validLanguages.includes(data.language as (typeof validLanguages)[number])) {
    return { success: false, error: "Invalid language selection." };
  }

  // Retry up to 2 times to handle Neon cold-start connection delays
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
        select: { id: true },
      });

      if (existing) {
        return { success: false, error: "An account with this email already exists." };
      }

      // bcrypt cost 10 — secure and fast enough for serverless (≈100ms vs ≈300ms for 12)
      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.user.create({
        data: {
          name: data.name.trim(),
          nickname: data.nickname?.trim() ?? null,
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          language: data.language,
        },
      });

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[registerUser] attempt ${attempt} error:`, msg);

      if (msg.includes("Unique constraint") || msg.includes("unique")) {
        return { success: false, error: "An account with this email already exists." };
      }

      if (attempt < 3) {
        // Wait for DB to wake from cold start before retrying
        await sleep(attempt * 1500);
        continue;
      }

      return { success: false, error: "Could not connect to the database. Please try again in a few seconds." };
    }
  }

  return { success: false, error: "Something went wrong. Please try again." };
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
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await prisma.userProfile.upsert({
        where: { userId: data.userId },
        create: {
          userId: data.userId,
          educationLevel: data.educationLevel,
          learningGoals: data.learningGoals,
          timeAvailable: data.timeAvailable,
          careerDream: data.careerDream,
          interests: data.interests,
        },
        update: {
          educationLevel: data.educationLevel,
          learningGoals: data.learningGoals,
          timeAvailable: data.timeAvailable,
          careerDream: data.careerDream,
          interests: data.interests,
        },
      });

      await prisma.user.update({
        where: { id: data.userId },
        data: { onboardingDone: true },
      });

      return { success: true };
    } catch (err) {
      console.error(`[saveOnboarding] attempt ${attempt} error:`, err);
      if (attempt < 2) {
        await sleep(1500);
        continue;
      }
      return { success: false, error: "Failed to save your profile. Please try again." };
    }
  }
  return { success: false, error: "Failed to save your profile." };
}
