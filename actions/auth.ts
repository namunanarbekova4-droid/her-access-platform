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

export async function registerUser(data: RegisterData): Promise<RegisterResult> {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const validLanguages = LANGUAGES.map((l) => l.code);
    if (!validLanguages.includes(data.language as (typeof validLanguages)[number])) {
      return { success: false, error: "Invalid language selection." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

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
    console.error("[registerUser] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint") || msg.includes("unique")) {
      return { success: false, error: "An account with this email already exists." };
    }
    return { success: false, error: "Something went wrong. Please try again." };
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
  } catch {
    return { success: false, error: "Failed to save your profile. Please try again." };
  }
}
