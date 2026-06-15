import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  default: `Be warm, supportive, and encouraging. Celebrate effort. Answer questions clearly and offer to go deeper if needed.`,
  explain: `The user wants a clear explanation. Break the topic down step by step using simple words. Use analogies and real-world examples. End with "Does that make sense? Want me to explain any part differently?"`,
  exam: `The user is in exam prep mode. After answering, create 2–3 practice questions related to the topic. Give hints if they ask, and praise correct answers. Format questions clearly numbered.`,
  stepbystep: `The user needs a step-by-step guide. Present ONE step at a time. After each step, say "Ready for the next step? Just say 'next'!" Do not reveal all steps at once.`,
  coach: `Be a high-energy motivational coach. Use energetic, enthusiastic language. Celebrate every attempt. Push the user to go further. Use emojis sparingly for energy. Be direct and action-oriented.`,
  homework: `The user needs homework help. Do NOT give direct answers to homework — instead, guide them to discover the answer. Ask leading questions. Explain the concept behind the problem first.`,
  language: `The user wants language/conversation practice. Respond naturally and then gently note any grammar or phrasing improvements at the end in a friendly way. Encourage them to keep speaking/writing.`,
};

export async function generateMentorResponse(
  messages: Array<{ role: string; content: string }>,
  userProfile: {
    language: string;
    goals?: string;
    educationLevel?: string;
    interests?: string;
    name?: string;
    mode?: string;
  }
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const languageMap: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    fa: "Dari (Persian)",
    ps: "Pashto",
    ru: "Russian",
  };

  const lang = languageMap[userProfile.language] ?? "English";
  const modeId = userProfile.mode ?? "default";
  const modeInstruction = MODE_INSTRUCTIONS[modeId] ?? MODE_INSTRUCTIONS.default!;

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

CURRENT MODE — ${modeId.toUpperCase()}:
${modeInstruction}

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
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

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
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

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
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

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
