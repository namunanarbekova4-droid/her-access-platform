"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Search, BookOpen, PlayCircle, ChevronRight, X, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Language & Literacy", "Digital Skills", "Financial Literacy", "Health & Rights", "Career Skills"];

const CATEGORY_GRADIENT: Record<string, string> = {
  "Language & Literacy": "from-blue-50 to-indigo-50",
  "Digital Skills": "from-cyan-50 to-sky-50",
  "Financial Literacy": "from-emerald-50 to-teal-50",
  "Health & Rights": "from-rose-50 to-pink-50",
  "Career Skills": "from-amber-50 to-yellow-50",
  English: "from-blue-50 to-indigo-50",
  Science: "from-green-50 to-emerald-50",
  Math: "from-orange-50 to-amber-50",
  Coding: "from-violet-50 to-purple-50",
  Leadership: "from-pink-50 to-rose-50",
};

const CATEGORY_ACCENT: Record<string, string> = {
  "Language & Literacy": "text-blue-600",
  "Digital Skills": "text-cyan-600",
  "Financial Literacy": "text-emerald-600",
  "Health & Rights": "text-rose-500",
  "Career Skills": "text-amber-600",
  English: "text-blue-600",
  Science: "text-green-600",
  Math: "text-orange-600",
  Coding: "text-violet-600",
  Leadership: "text-pink-600",
};

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  difficulty: string;
  imageEmoji: string;
  createdAt?: string;
  _count: { lessons: number; materials: number; videos: number };
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

function embedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  if (url.includes("drive.google.com")) return url.replace("/view", "/preview");
  return url;
}

function VideoModal({ video, onClose }: { video: VideoLesson; onClose: () => void }) {
  const src = embedUrl(video.videoUrl);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{video.title}</h3>
            {video.duration && <p className="text-xs text-gray-400 mt-0.5">{video.duration}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="aspect-video bg-black">
          <iframe src={src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
        {video.description && <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100">{video.description}</div>}
      </div>
    </div>
  );
}

function VideoCard({ video, onClick }: { video: VideoLesson; onClick: () => void }) {
  return (
    <motion.button whileHover={{ y: -2 }} transition={{ duration: 0.2 }} onClick={onClick}
      className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group text-left w-full">
      <div className="relative aspect-video bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center overflow-hidden">
        {video.thumbnailUrl
          ? <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
          : <PlayCircle size={36} className="text-brand-purple/40" />}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={20} className="text-brand-purple ml-0.5" fill="currentColor" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{video.duration}</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">{video.title}</p>
        <p className="text-xs text-muted mt-1">{video.category}</p>
      </div>
    </motion.button>
  );
}

function CourseCard({ course }: { course: Course }) {
  const gradient = CATEGORY_GRADIENT[course.category] ?? "from-gray-50 to-gray-100";
  const accent = CATEGORY_ACCENT[course.category] ?? "text-gray-600";
  const lessonCount = course._count.lessons || course._count.materials || 0;

  return (
    <Link href={`/library/${course.id}`}>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden group">
        <div className={cn("px-5 pt-5 pb-4 bg-gradient-to-br", gradient)}>
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              {course.imageEmoji}
            </div>
            <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/70 border border-white/50", accent)}>
              {course.category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground mt-3 leading-snug group-hover:text-brand-purple transition-colors">
            {course.title}
          </h3>
        </div>

        <div className="px-5 py-4 flex-1 flex flex-col">
          <p className="text-xs text-muted leading-relaxed flex-1 mb-4 line-clamp-3">{course.description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className={cn("flex items-center gap-1 text-xs font-medium", accent)}>
              <BookOpen size={11} />
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </div>
            <ChevronRight size={16} className="text-muted group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all" />
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
          <Skeleton className="w-24 h-5 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-4 w-3/4 rounded" />
      </div>
      <div className="px-5 py-4">
        <Skeleton className="h-3 w-full rounded mb-1.5" />
        <Skeleton className="h-3 w-5/6 rounded mb-1.5" />
        <Skeleton className="h-3 w-4/6 rounded mb-4" />
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LibraryView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  const loadData = useCallback(async () => {
    const [courseData, videoData] = await Promise.all([
      fetch("/api/courses").then((r) => r.json()).catch(() => ({})) as Promise<{ courses?: Course[] }>,
      fetch("/api/videos").then((r) => r.json()).catch(() => ({})) as Promise<{ videos?: VideoLesson[] }>,
    ]);
    return { courses: courseData.courses ?? [], videos: videoData.videos ?? [] };
  }, []);

  useEffect(() => {
    loadData().then(({ courses: c, videos: v }) => {
      setCourses(c);
      setVideos(v);
      setLoading(false);

      if (c.length === 0) {
        setInitializing(true);
        fetch("/api/courses/init-ai", { method: "POST" })
          .then((r) => r.json())
          .then((d: { seeded?: boolean }) => {
            if (d.seeded) return loadData();
            return { courses: c, videos: v };
          })
          .then(({ courses: nc, videos: nv }) => {
            setCourses(nc);
            setVideos(nv);
          })
          .catch(() => null)
          .finally(() => setInitializing(false));
      }
    });
  }, [loadData]);

  const filteredCourses = courses.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ = q === "" || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const standaloneVideos = videos.filter((v) => !v.courseId);
  const filteredVideos = standaloneVideos.filter((v) => {
    const q = query.toLowerCase();
    return q === "" || v.title.toLowerCase().includes(q) || (v.description ?? "").toLowerCase().includes(q);
  });

  const hasContent = filteredCourses.length > 0 || filteredVideos.length > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">Quiet Library</h1>
        <p className="text-muted text-sm">Structured courses — study anywhere, even offline.</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses and videos…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
          />
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                activeCategory === cat
                  ? "bg-brand-purple text-white border-brand-purple shadow-soft"
                  : "bg-white text-muted border-border hover:border-brand-purple/50 hover:text-brand-purple"
              )}>{cat}</button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading || initializing ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {initializing && (
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 mb-6">
                <Sparkles size={16} className="text-purple-600 animate-pulse" />
                <p className="text-sm text-purple-700">Creating your personalised library… this takes about 10 seconds.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          </motion.div>
        ) : !hasContent ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Search size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                {query || activeCategory !== "All" ? "No courses match your filters" : "No courses yet"}
              </p>
              {(query || activeCategory !== "All") && (
                <Button variant="outline" size="sm" className="mt-4"
                  onClick={() => { setQuery(""); setActiveCategory("All"); }}>
                  Clear filters
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
            {filteredCourses.length > 0 && (
              <section>
                {filteredVideos.length > 0 && (
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    Courses <span className="text-xs font-normal text-muted ml-1">{filteredCourses.length}</span>
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course, i) => (
                    <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {filteredVideos.length > 0 && (
              <section>
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Video Lessons <span className="text-xs font-normal text-muted ml-1">{filteredVideos.length} videos</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredVideos.map((video, i) => (
                    <motion.div key={video.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                      <VideoCard video={video} onClick={() => setActiveVideo(video)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}
