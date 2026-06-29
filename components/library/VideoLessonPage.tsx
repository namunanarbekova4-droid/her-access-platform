"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle2,
  WifiOff,
  ExternalLink,
  PlayCircle,
  BookOpen,
  Tag,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { createYoutubeEmbedUrl, extractYoutubeVideoId } from "@/lib/youtube";
import {
  saveLessonOffline,
  removeOfflineLesson,
  isLessonSaved,
  getOfflineLesson,
  type OfflineLesson,
} from "@/lib/offline-lessons";
import { cn } from "@/lib/utils";

// ── String constants (i18n-ready) ────────────────────────────────────────────
const S = {
  back: "Back to Library",
  saveOffline: "Bookmark",
  savedOffline: "Bookmarked",
  removeOffline: "Remove Bookmark",
  markComplete: "Mark as Complete",
  completed: "Completed",
  offlineTitle: "No internet connection",
  offlineMsg: "Video playback requires an internet connection.",
  watchOnYouTube: "Watch on YouTube",
  lessonNotFound: "Lesson not found",
  noVideoSaved: "No internet connection. Open this page when you're online to watch the video.",
  invalidUrl: "This lesson has no playable video.",
  loadError: "Failed to load lesson",
  savedToast: "Bookmarked — you can find it in your saved list ✓",
  removedToast: "Bookmark removed",
  completedToast: "🎉 Lesson marked as complete!",
  uncompletedToast: "Lesson marked as incomplete",
  aboutLesson: "About this lesson",
  offlineContent: "Lesson notes",
};

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  language: string;
  courseId: string | null;
}

// ── YouTube player with loading skeleton ─────────────────────────────────────
function YoutubePlayer({ embedUrl, title }: { embedUrl: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#3B1347] to-[#5a1e70]">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <PlayCircle size={32} className="text-[#F4D1FF] animate-pulse" />
          </div>
          <p className="text-[#F4D1FF]/70 text-sm">Loading video…</p>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className={cn(
          "w-full h-full transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ── Offline video placeholder ─────────────────────────────────────────────────
function OfflinePlaceholder({
  youtubeUrl,
  isOnline,
}: {
  youtubeUrl: string;
  isOnline: boolean;
}) {
  const videoId = extractYoutubeVideoId(youtubeUrl);
  const ytUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : youtubeUrl;

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300">
      <WifiOff size={40} className="text-gray-400" />
      <div className="text-center px-6">
        <p className="font-semibold text-gray-700">{S.offlineTitle}</p>
        <p className="text-sm text-gray-500 mt-1">{S.offlineMsg}</p>
      </div>
      {isOnline ? (
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B1347] text-white text-sm font-medium hover:bg-[#4a1a5a] transition-colors"
        >
          <ExternalLink size={14} />
          {S.watchOnYouTube}
        </a>
      ) : (
        <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-300 text-gray-500 text-sm font-medium cursor-not-allowed select-none">
          <ExternalLink size={14} />
          {S.watchOnYouTube}
        </span>
      )}
    </div>
  );
}

// ── Page loading skeleton ─────────────────────────────────────────────────────
function LessonSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <Skeleton className="h-5 w-32 rounded-xl mb-6" />
      <Skeleton className="w-full aspect-video rounded-2xl mb-6" />
      <Skeleton className="h-5 w-20 rounded-full mb-3" />
      <Skeleton className="h-7 w-3/4 rounded mb-2" />
      <Skeleton className="h-4 w-1/4 rounded mb-6" />
      <div className="flex gap-3 mb-6">
        <Skeleton className="flex-1 h-12 rounded-2xl" />
        <Skeleton className="flex-1 h-12 rounded-2xl" />
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function VideoLessonPage({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [fromOfflineCache, setFromOfflineCache] = useState(false);

  // Online/offline detection
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Sync saved state from localStorage
  useEffect(() => {
    setIsSaved(isLessonSaved(lessonId));
  }, [lessonId]);

  // Fetch lesson + progress (with offline fallback)
  useEffect(() => {
    const cached = getOfflineLesson(lessonId);

    Promise.all([
      fetch(`/api/lessons/${lessonId}`).then((r) => r.json()),
      fetch(`/api/lessons/${lessonId}/progress`)
        .then((r) => r.json())
        .catch(() => ({ completed: false })),
    ])
      .then(([lessonData, progressData]) => {
        if ((lessonData as { error?: string }).error) {
          setError((lessonData as { error: string }).error);
        } else {
          setLesson((lessonData as { lesson: Lesson }).lesson);
          setCompleted(
            ((progressData as { completed?: boolean }).completed) ?? false
          );
        }
        setLoading(false);
      })
      .catch(() => {
        // Network failed — fall back to offline cache if available
        if (cached) {
          setLesson({
            id: cached.id,
            title: cached.title,
            description: cached.notes || cached.description,
            category: "Saved",
            videoUrl: cached.youtubeUrl,
            thumbnailUrl: null,
            duration: null,
            language: "en",
            courseId: null,
          });
          setFromOfflineCache(true);
        } else {
          setError(
            !navigator.onLine ? S.noVideoSaved : S.loadError
          );
        }
        setLoading(false);
      });
  }, [lessonId]);

  const embedUrl = useMemo(
    () => (lesson ? createYoutubeEmbedUrl(lesson.videoUrl) : null),
    [lesson]
  );

  const handleSaveOffline = useCallback(() => {
    if (!lesson) return;
    if (isSaved) {
      removeOfflineLesson(lesson.id);
      setIsSaved(false);
      toast(S.removedToast);
    } else {
      const offlineLesson: OfflineLesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? "",
        youtubeUrl: lesson.videoUrl,
        notes: lesson.description ?? "",
        savedAt: new Date().toISOString(),
      };
      saveLessonOffline(offlineLesson);
      setIsSaved(true);
      toast.success(S.savedToast);
    }
  }, [lesson, isSaved]);

  const handleToggleComplete = useCallback(async () => {
    if (!lesson || completing) return;
    setCompleting(true);
    const next = !completed;
    setCompleted(next); // optimistic
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
      });
      const data = (await res.json()) as { completed?: boolean };
      setCompleted(data.completed ?? next);
      toast.success(data.completed ? S.completedToast : S.uncompletedToast);
    } catch {
      setCompleted(!next); // revert on failure
    } finally {
      setCompleting(false);
    }
  }, [lesson, completed, completing]);

  if (loading) return <LessonSkeleton />;

  if (error || !lesson) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-purple mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {S.back}
        </Link>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center">
          <WifiOff size={32} className="mx-auto text-rose-400 mb-3" />
          <p className="text-rose-700 font-medium">{error ?? S.lessonNotFound}</p>
        </div>
      </div>
    );
  }

  const showVideo = !fromOfflineCache && isOnline && embedUrl;
  const showOfflinePlaceholder = !showVideo;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-purple mb-6 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        {S.back}
      </Link>

      {/* Video / offline placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        {showVideo ? (
          <YoutubePlayer embedUrl={embedUrl} title={lesson.title} />
        ) : showOfflinePlaceholder ? (
          <OfflinePlaceholder youtubeUrl={lesson.videoUrl} isOnline={isOnline} />
        ) : (
          <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
            <p className="text-sm text-gray-400">{S.invalidUrl}</p>
          </div>
        )}
      </motion.div>

      {/* Meta: category + title + duration + completion badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-5"
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {lesson.category && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#3B1347] bg-[#F4D1FF]/60 px-2.5 py-0.5 rounded-full">
              <Tag size={10} />
              {lesson.category}
            </span>
          )}
          {lesson.duration && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock size={10} />
              {lesson.duration}
            </span>
          )}
          {completed && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              {S.completed}
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-snug">
          {lesson.title}
        </h1>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Mark complete */}
        <button
          onClick={handleToggleComplete}
          disabled={completing}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200",
            completed
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-[#3B1347] text-white hover:bg-[#4a1a5a] active:scale-[0.98]",
            completing && "opacity-60 cursor-not-allowed"
          )}
        >
          <CheckCircle2 size={16} />
          {completed ? S.completed : S.markComplete}
        </button>

        {/* Save / remove offline */}
        <button
          onClick={handleSaveOffline}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm border transition-all duration-200 active:scale-[0.98]",
            isSaved
              ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
              : "bg-white text-[#3B1347] border-[#3B1347]/20 hover:bg-[#F4D1FF]/40 hover:border-[#3B1347]/40"
          )}
        >
          {isSaved ? <Trash2 size={16} /> : <Download size={16} />}
          {isSaved ? S.removeOffline : S.saveOffline}
        </button>
      </motion.div>

      {/* Description / offline notes */}
      {lesson.description && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-[#3B1347]" />
              <h2 className="text-sm font-semibold text-foreground">
                {fromOfflineCache ? S.offlineContent : S.aboutLesson}
              </h2>
            </div>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
              {lesson.description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
