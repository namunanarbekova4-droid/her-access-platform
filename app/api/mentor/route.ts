import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMentorResponse } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as {
      messages: Array<{ role: string; content: string }>;
    };
    const { messages } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.userProfile.findUnique({ where: { userId: session.user.id } }),
    ]);

    const response = await generateMentorResponse(messages, {
      language: user?.language ?? "en",
      goals: profile?.learningGoals ?? undefined,
      educationLevel: profile?.educationLevel ?? undefined,
      interests: profile?.interests ?? undefined,
      name: user?.nickname ?? user?.name ?? undefined,
    });

    const lastMessage = messages[messages.length - 1];

    await prisma.message.createMany({
      data: [
        {
          userId: session.user.id,
          role: "user",
          content: lastMessage?.content ?? "",
        },
        {
          userId: session.user.id,
          role: "assistant",
          content: response,
        },
      ],
    });

    return NextResponse.json({ response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI service unavailable";
    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured. Please add your Gemini API key." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "AI temporarily unavailable. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
