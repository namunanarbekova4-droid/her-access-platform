import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMultipleStories } from "@/lib/gemini";
import { parseJsonSafe } from "@/lib/utils";
import type { Story } from "@/types";

const fallbackStories: Story[] = [
  {
    id: "1",
    title: "The Code That Changed Everything",
    protagonist: "Layla",
    region: "Central Asia",
    field: "Technology",
    content:
      "Layla taught herself to code using an old phone and free tutorials downloaded at the library. Her family didn't understand why she spent nights staring at a screen. In a village where girls were expected to marry young, she had a different dream. Three years of quiet determination led her to win an online scholarship competition. Today she builds apps that help farmers in her region access weather data — solving a real problem for people she loves, using skills she taught herself in secret. She never stopped. Not once.",
    lesson: "Quiet persistence builds the loudest impact.",
    achievement: "Won international coding scholarship, now a software engineer",
    emoji: "💻",
  },
  {
    id: "2",
    title: "A Doctor in the Making",
    protagonist: "Mariam",
    region: "Middle East",
    field: "Medicine",
    content:
      "When Mariam's school closed, she borrowed medical textbooks from a neighbor and read them by lamplight. Everyone around her said it was impossible — a girl from her background becoming a doctor. She memorized anatomy diagrams, practiced on a sketchpad, and wrote letters to universities in neighboring countries. One said yes. She borrowed money, crossed a border, and enrolled at 19. Seven years later, Dr. Mariam returned home to open the first women's health clinic in her district. She sees 40 patients a day. She never forgot where she came from.",
    lesson: "The impossible is just a word until you prove otherwise.",
    achievement: "Became a physician and founded a women's health clinic",
    emoji: "🏥",
  },
  {
    id: "3",
    title: "English Was Her Passport",
    protagonist: "Nadia",
    region: "South Asia",
    field: "Languages & Business",
    content:
      "Nadia's parents spoke no English. Their small shop barely covered expenses. She started listening to English radio programs at age 13, repeating phrases under her breath during chores. She found an online course and completed it in pieces — ten minutes here, twenty there. By 16 she was translating for NGO workers visiting her town. By 18 she had a remote job. By 22 she was managing a team of translators across three countries — all from her childhood bedroom. Language was the door. She walked through it.",
    lesson: "Every language you learn is a new world that opens.",
    achievement: "Founded a translation company employing 50+ women",
    emoji: "🌍",
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const rawStories = await generateMultipleStories(3);
      const stories = parseJsonSafe<Story[]>(rawStories, fallbackStories);
      return NextResponse.json({ stories: stories.length > 0 ? stories : fallbackStories });
    } catch {
      return NextResponse.json({ stories: fallbackStories });
    }
  } catch {
    return NextResponse.json({ stories: fallbackStories });
  }
}
