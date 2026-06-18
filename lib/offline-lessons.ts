const STORAGE_KEY = "heraccess_offline_lessons";

export interface OfflineLesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  notes: string;
  savedAt: string;
}

function read(): OfflineLesson[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as OfflineLesson[];
  } catch {
    return [];
  }
}

function write(lessons: OfflineLesson[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  } catch {
    // localStorage may be unavailable in private mode
  }
}

export function getOfflineLessons(): OfflineLesson[] {
  return read();
}

export function getOfflineLesson(id: string): OfflineLesson | null {
  return read().find((l) => l.id === id) ?? null;
}

export function saveLessonOffline(lesson: OfflineLesson): void {
  const existing = read().filter((l) => l.id !== lesson.id);
  write([...existing, lesson]);
}

export function removeOfflineLesson(id: string): void {
  write(read().filter((l) => l.id !== id));
}

export function isLessonSaved(id: string): boolean {
  return read().some((l) => l.id === id);
}
