"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, BookOpen, PlayCircle, Clock, ChevronRight } from "lucide-react";
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
        {/* Top colour band */}
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

        {/* Body */}
        <div className="px-5 py-4 flex-1 flex flex-col">
          <p className="text-xs text-muted leading-relaxed flex-1 mb-4 line-clamp-3">
            {course.description}
          </p>

          {/* Stats */}
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
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d: { courses?: Course[] }) => {
        setCourses(d.courses ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

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
            placeholder="Search courses…"
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

      {/* Course grid */}
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
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              emoji="🔍"
              title="No courses found"
              description={
                query
                  ? `No results for "${query}". Try a different search term.`
                  : "No courses in this category yet."
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
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
