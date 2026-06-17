"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, BookOpen, PlayCircle, Clock, ChevronRight, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  difficulty: string;
  imageEmoji: string;
  _count: { materials: number; lessons: number };
}

interface VideoLesson {
  id: string;
  title: string;
  description: string | null;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: string | null;
  language: string;
  sortOrder: number;
  courseId: string | null;
}

type Category = "All" | "English" | "Science" | "Math" | "Coding" | "Leadership";

const CATEGORIES: Category[] = ["All", "English", "Science", "Math", "Coding", "Leadership"];

const CATEGORY_EMOJIS: Record<string, string> = {
  English: "📖",
  Science: "🔬",
  Math: "📐",
  Coding: "💻",
  Leadership: "🌟",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  English: "from-blue-50 to-indigo-50",
  Science: "from-green-50 to-emerald-50",
  Math: "from-orange-50 to-amber-50",
  Coding: "from-violet-50 to-purple-50",
  Leadership: "from-pink-50 to-rose-50",
};

const CATEGORY_ACCENT: Record<string, string> = {
  English: "text-blue-600",
  Science: "text-green-600",
  Math: "text-orange-600",
  Coding: "text-violet-600",
  Leadership: "text-pink-600",
};

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "error" | "default"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

function embedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  // Google Drive (already converted to /preview by admin)
  if (url.includes("drive.google.com")) return url.replace("/view", "/preview");
  return url;
}

function VideoModal({ video, onClose }: { video: VideoLesson; onClose: () => void }) {
  const src = embedUrl(video.videoUrl);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{video.title}</h3>
            {video.duration && <p className="text-xs text-gray-400 mt-0.5">{video.duration}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            src={src}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {video.description && (
          <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100">{video.description}</div>
        )}
      </div>
    </div>
  );
}

function VideoCard({ video, onClick }: { video: VideoLesson; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group text-left w-full"
    >
      {/* Thumbnail / placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center overflow-hidden">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <PlayCircle size={36} className="text-brand-purple/40" />
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={20} className="text-brand-purple ml-0.5" fill="currentColor" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
            {video.duration}
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
          {video.title}
        </p>
        <p className="text-xs text-muted mt-1">{video.category}</p>
      </div>
    </motion.button>
  );
}

function CourseCard({ course }: { course: Course }) {
  const gradient = CATEGORY_GRADIENT[course.category] ?? "from-gray-50 to-gray-100";
  const accent = CATEGORY_ACCENT[course.category] ?? "text-gray-600";

  return (
    <Link href={`/library/${course.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden group"
      >
        <div className={cn("px-5 pt-5 pb-4 bg-gradient-to-br", gradient)}>
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              {course.imageEmoji}
            </div>
            <Badge variant={DIFFICULTY_VARIANT[course.difficulty] ?? "default"}>
              {course.difficulty}
            </Badge>
          </div>
          <h3 className="text-base font-semibold text-foreground mt-3 leading-snug group-hover:text-brand-purple transition-colors">
            {course.title}
          </h3>
        </div>

        <div className="px-5 py-4 flex-1 flex flex-col">
          <p className="text-xs text-muted leading-relaxed flex-1 mb-4 line-clamp-3">
            {course.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center gap-1 text-xs font-medium", accent)}>
                <Clock size={11} />
                {course.totalWeeks}w
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <PlayCircle size={11} />
                {course._count.lessons} videos
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <BookOpen size={11} />
                {course._count.materials} reads
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-muted group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-4 bg-gray-50">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-4 w-3/4 rounded" />
      </div>
      <div className="px-5 py-4">
        <Skeleton className="h-3 w-full rounded mb-1.5" />
        <Skeleton className="h-3 w-5/6 rounded mb-1.5" />
        <Skeleton className="h-3 w-4/6 rounded mb-4" />
        <div className="flex gap-3 pt-3 border-t border-border">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LibraryView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => r.json()).catch(() => ({})),
      fetch("/api/videos").then((r) => r.json()).catch(() => ({})),
    ]).then(([courseData, videoData]: [{ courses?: Course[] }, { videos?: VideoLesson[] }]) => {
      setCourses(courseData.courses ?? []);
      setVideos(videoData.videos ?? []);
      setLoading(false);
    });
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Standalone videos (not linked to any course)
  const standaloneVideos = videos.filter((v) => !v.courseId);
  const filteredVideos = standaloneVideos.filter((v) => {
    const q = query.toLowerCase();
    return (
      q === "" ||
      v.title.toLowerCase().includes(q) ||
      (v.description ?? "").toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  const hasContent = filteredCourses.length > 0 || filteredVideos.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
          Quiet Library
        </h1>
        <p className="text-muted text-sm">
          Structured courses with video lessons and reading materials — study anywhere, even offline.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-5"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses and videos…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
              activeCategory === cat
                ? "bg-brand-purple text-white border-brand-purple shadow-soft"
                : "bg-white text-muted border-border hover:border-brand-purple/50 hover:text-brand-purple"
            )}
          >
            {cat !== "All" && (
              <span className="mr-1.5">{CATEGORY_EMOJIS[cat]}</span>
            )}
            {cat}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : !hasContent ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              emoji="🔍"
              title="No content found"
              description={
                query
                  ? `No results for "${query}". Try a different search term.`
                  : "No courses or videos in this category yet."
              }
              action={
                query || activeCategory !== "All" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setQuery(""); setActiveCategory("All"); }}
                  >
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Courses section */}
            {filteredCourses.length > 0 && (
              <section>
                {filteredVideos.length > 0 && (
                  <h2 className="text-base font-semibold text-foreground mb-4">Courses</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Standalone video lessons section */}
            {filteredVideos.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Video Lessons
                  <span className="ml-2 text-xs font-normal text-muted">{filteredVideos.length} videos</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredVideos.map((video, i) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <VideoCard video={video} onClick={() => setActiveVideo(video)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video player modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
