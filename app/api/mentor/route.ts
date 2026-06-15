import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMentorResponse } from "@/lib/gemini";
import { neon } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as {
      messages: Array<{ role: string; content: string }>;
      mode?: string;
    };
    const { messages, mode } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const userId = session.user.id;

    const [userRows, profileRows] = await Promise.all([
      sql`SELECT name, nickname, language FROM "User" WHERE id = ${userId} LIMIT 1`.catch(() => []),
      sql`SELECT "learningGoals", "educationLevel", interests FROM "UserProfile" WHERE "userId" = ${userId} LIMIT 1`.catch(() => []),
    ]);

    const user = userRows[0] ?? null;
    const profile = profileRows[0] ?? null;

    const response = await generateMentorResponse(messages, {
      language: (user?.language as string) ?? "en",
      goals: (profile?.learningGoals as string) ?? undefined,
      educationLevel: (profile?.educationLevel as string) ?? undefined,
      interests: (profile?.interests as string) ?? undefined,
      name: (user?.nickname as string) ?? (user?.name as string) ?? undefined,
      mode: mode ?? "default",
    });

    const lastMessage = messages[messages.length - 1];
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "Message" (id, "userId", role, content, "createdAt")
      VALUES
        (${"m" + Date.now().toString(36) + "a"}, ${userId}, 'user', ${lastMessage?.content ?? ""}, ${now}::timestamp),
        (${"m" + Date.now().toString(36) + "b"}, ${userId}, 'assistant', ${response}, ${now}::timestamp)
    `.catch(() => {});

    return NextResponse.json({ response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI service unavailable";
    if (message.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service not configured. Please add your Gemini API key." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: `AI error: ${message.slice(0, 300)}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const messages = await sql`
      SELECT id, "userId", role, content, "createdAt"
      FROM "Message"
      WHERE "userId" = ${session.user.id}
      ORDER BY "createdAt" ASC
      LIMIT 50
    `.catch(() => []);

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
