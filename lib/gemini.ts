import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateMentorResponse(
  messages: Array<{ role: string; content: string }>,
  userProfile: {
    language: string;
    goals?: string;
    educationLevel?: string;
    interests?: string;
    name?: string;
  }
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const languageMap: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    fa: "Dari (Persian)",
    ps: "Pashto",
    ru: "Russian",
  };

  const lang = languageMap[userProfile.language] ?? "English";

  const systemContext = `You are Noor, a warm, intelligent, and empowering AI mentor for Her Access — a platform that helps girls in restricted regions access education.

Your personality:
- Warm, encouraging, and emotionally intelligent
- Patient and never judgmental
- Celebrates small wins enthusiastically
- Uses simple, clear language appropriate for the learner's level
- Always responds in ${lang}
- Culturally sensitive and respectful

User profile:
- Name: ${userProfile.name ?? "dear learner"}
- Learning goals: ${userProfile.goals ?? "general education"}
- Education level: ${userProfile.educationLevel ?? "not specified"}
- Interests: ${userProfile.interests ?? "various topics"}

You can:
- Explain complex concepts simply
- Create personalized study plans
- Answer academic questions
- Provide emotional encouragement
- Recommend learning paths
- Motivate during difficult times

Always respond in ${lang}. Be warm, clear, and empowering.`;

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemContext }] },
      {
        role: "model",
        parts: [
          {
            text: `I understand. I'm Noor, and I'll respond in ${lang} with warmth and encouragement.`,
          },
        ],
      },
      ...history,
    ],
  });

  const result = await chat.sendMessage(lastMessage?.content ?? "Hello");
  return result.response.text();
}

export async function generateLearningPath(profile: {
  goals: string;
  educationLevel: string;
  timeAvailable: string;
  interests: string;
  language: string;
}): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create a personalized 12-week learning roadmap for a girl with these details:
- Learning goals: ${profile.goals}
- Current education level: ${profile.educationLevel}
- Time available per day: ${profile.timeAvailable}
- Interests: ${profile.interests}

Return a JSON object with this exact structure:
{
  "title": "Roadmap title",
  "description": "Brief inspiring description",
  "totalWeeks": 12,
  "milestones": [
    {
      "week": 1,
      "title": "Week title",
      "description": "What to accomplish",
      "topics": ["topic1", "topic2"],
      "resources": ["resource1", "resource2"],
      "goal": "Specific measurable goal"
    }
  ],
  "weeklySchedule": {
    "monday": "Activity",
    "tuesday": "Activity",
    "wednesday": "Activity",
    "thursday": "Activity",
    "friday": "Activity",
    "saturday": "Review/Practice",
    "sunday": "Rest/Light reading"
  }
}

Make it realistic, encouraging, and achievable. Return ONLY the JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateInspirationalStory(profile: {
  goals: string;
  interests: string;
  language: string;
}): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Write a short, realistic, emotionally resonant inspirational story (200-250 words) about a young woman who overcame restrictions to achieve education and success.

The story should relate to:
- Goals like: ${profile.goals}
- Interests like: ${profile.interests}

Return JSON:
{
  "title": "Story title",
  "protagonist": "Name of the protagonist",
  "region": "Region/country (be general)",
  "content": "The full story (200-250 words)",
  "lesson": "Key lesson in one sentence",
  "achievement": "What she achieved"
}

Make it realistic, emotionally moving, and empowering. No clichés. Return ONLY JSON.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateMultipleStories(
  count: number = 3
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate ${count} different short inspirational stories about young women from restricted regions who achieved educational success. Each story should be unique and cover different fields (technology, medicine, arts, business, science).

Return a JSON array:
[
  {
    "id": "1",
    "title": "Story title",
    "protagonist": "Name",
    "region": "Region",
    "field": "Field of achievement",
    "content": "Story content (150-200 words)",
    "lesson": "Key lesson",
    "achievement": "What she achieved",
    "emoji": "Relevant emoji"
  }
]

Make them diverse, realistic, and deeply moving. Return ONLY the JSON array.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
