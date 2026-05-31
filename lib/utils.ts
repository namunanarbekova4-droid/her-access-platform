import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${greeting}, ${name}` : greeting;
}

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "fa", name: "Dari", nativeName: "دری", dir: "rtl" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", dir: "rtl" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
] as const;

export const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School" },
  { value: "high_school", label: "High School" },
  { value: "university", label: "University Level" },
  { value: "self_taught", label: "Self-taught" },
];

export const LEARNING_GOALS = [
  { value: "english", label: "Learn English", emoji: "🌍" },
  { value: "stem", label: "STEM & Science", emoji: "🔬" },
  { value: "coding", label: "Coding & Technology", emoji: "💻" },
  { value: "business", label: "Business & Finance", emoji: "📊" },
  { value: "leadership", label: "Leadership Skills", emoji: "🌟" },
  { value: "arts", label: "Arts & Creativity", emoji: "🎨" },
  { value: "health", label: "Health & Medicine", emoji: "🏥" },
  { value: "languages", label: "Foreign Languages", emoji: "🗣️" },
];

export const TIME_OPTIONS = [
  { value: "30min", label: "30 minutes/day" },
  { value: "1hour", label: "1 hour/day" },
  { value: "2hours", label: "2 hours/day" },
  { value: "3hours", label: "3+ hours/day" },
];

export function parseJsonSafe<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export function generateAnonymousNickname(): string {
  const adjectives = [
    "Bright",
    "Brave",
    "Curious",
    "Hopeful",
    "Gentle",
    "Wise",
    "Kind",
    "Bold",
    "Free",
    "Strong",
  ];
  const nouns = [
    "Star",
    "Moon",
    "Rose",
    "Bird",
    "River",
    "Light",
    "Dawn",
    "Dream",
    "Wave",
    "Leaf",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}
