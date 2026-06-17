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
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await chat.sendMessage(lastMessage?.content ?? "Hello");
      return result.response.text();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("503") && !msg.includes("overloaded") && !msg.includes("high demand")) throw err;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function generateLearningPath(profile: {
  goals: string;
  educationLevel: string;
  timeAvailable: string;
  interests: string;
  language: string;
}): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

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

export async function generateCourseWithAI(
  topic: string,
  options: { category?: string; difficulty?: string; language?: string; weeks?: number } = {}
): Promise<{
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageEmoji: string;
  totalWeeks: number;
  language: string;
  weeks: Array<{ week: number; title: string; videoTitle: string; videoUrl: string; content: string }>;
}> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  const numWeeks = options.weeks ?? 4;
  const category = options.category ?? "Digital Skills";
  const difficulty = options.difficulty ?? "Beginner";
  const lang = options.language ?? "en";

  const prompt = `Create a complete educational course about "${topic}" for young women in developing regions who may have limited prior education.

Return a JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):
{
  "title": "Concise inspiring course title",
  "description": "2-3 sentence motivating course description",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "imageEmoji": "single relevant emoji",
  "totalWeeks": ${numWeeks},
  "language": "${lang}",
  "weeks": [
    {
      "week": 1,
      "title": "Week topic title",
      "videoTitle": "Title for the video lesson",
      "videoUrl": "",
      "content": "Full markdown lesson (400-600 words) with ## headings, tables, bullet points, practice exercises, and ## Key Takeaways at the end"
    }
  ]
}

Write ${numWeeks} week objects. Each lesson must be practical, use real examples relevant to girls in Central Asia, Middle East, or Africa, and end with 2-3 practice exercises.
Return ONLY valid JSON.`;

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim()
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("503") && !msg.includes("overloaded") && !msg.includes("high demand")) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function generateLessonContent(
  topic: string,
  courseTitle: string,
  weekNumber: number,
  difficulty: string = "Beginner"
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Write a complete educational lesson in Markdown for Week ${weekNumber} of "${courseTitle}".
Topic: ${topic}
Difficulty: ${difficulty}
Audience: Young women aged 14-25 with limited prior education in developing regions.

The lesson should have:
- A clear # Week ${weekNumber}: Title heading
- ## What You'll Learn section
- 3-4 main ## content sections with explanations, tables where helpful, and real examples
- ## Practice Exercises section with 2-3 exercises
- ## Key Takeaways section with 4-5 checkmark bullet points

Length: 500-700 words. Write in clear, simple English. Return ONLY the markdown content.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateCourseStubs(language: string = "en"): Promise<Array<{
  category: string;
  title: string;
  description: string;
  imageEmoji: string;
  lessonTitles: string[];
}>> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const langName = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";

  const prompt = `You are an expert educator creating a curriculum for girls aged 15-30 in developing countries (Central Asia, Middle East, Africa) who face educational restrictions.

Generate EXACTLY 15 courses — 3 per category for these 5 categories:
1. Language & Literacy
2. Digital Skills
3. Financial Literacy
4. Health & Rights
5. Career Skills

Rules:
- Write all text in ${langName}
- Titles must be specific and practical (NOT generic like "Introduction to X")
- Descriptions explain immediate, real-life benefit (2 sentences)
- Each course must have exactly 3 distinct lesson titles that build on each other

Return ONLY a JSON array of exactly 15 objects:
[
  {
    "category": "Language & Literacy",
    "title": "...",
    "description": "Sentence 1. Sentence 2.",
    "imageEmoji": "one emoji",
    "lessonTitles": ["Lesson title 1", "Lesson title 2", "Lesson title 3"]
  }
]

Return ONLY valid JSON. No markdown. No extra text.`;

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim()
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("503") && !msg.includes("overloaded") && !msg.includes("high demand")) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function generateCourseLessonsContent(
  courseTitle: string,
  category: string,
  lessonTitles: string[],
  language: string = "en"
): Promise<Array<{
  id: string;
  title: string;
  content: string;
  examples: string[];
  key_takeaways: string[];
  assignment: string;
  quiz: Array<{ question: string; options: string[]; correct_answer: string }>;
  downloadable_summary: string;
}>> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const langName = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";

  const prompt = `You are an expert educator writing lesson content for girls aged 15-30 in developing countries. Write entirely in ${langName}.

Course: "${courseTitle}"
Category: ${category}

Generate EXACTLY ${lessonTitles.length} lessons for these titles:
${lessonTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return ONLY a JSON array:
[
  {
    "id": "1",
    "title": "exact lesson title",
    "content": "280-320 words of clear, practical content. Use short paragraphs. Include real-world examples from Central Asia, Middle East, or Africa. End with 2 practical exercises.",
    "examples": ["Concrete example 1 with real-world context", "Concrete example 2 with real-world context"],
    "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3", "Takeaway 4"],
    "assignment": "One practical task the student can do TODAY with no equipment or internet needed.",
    "quiz": [
      {"question": "Clear question testing real understanding", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correct_answer": "A"},
      {"question": "Second question", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correct_answer": "B"},
      {"question": "Third question", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correct_answer": "C"}
    ],
    "downloadable_summary": "3-4 bullet points summarising key points. Can be printed or hand-written."
  }
]

Write all text in ${langName}. Content must be immediately useful. No jargon.
Return ONLY the JSON array.`;

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim()
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("503") && !msg.includes("overloaded") && !msg.includes("high demand")) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function generateMultipleStories(
  count: number = 3
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

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
