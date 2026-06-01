"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  Clock,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LibraryItem {
  id: string;
  title: string;
  content: string;
  weekNumber: number | null;
  type: string | null;
}

interface VideoLesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string | null;
  weekNumber: number | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  difficulty: string;
  imageEmoji: string;
  materials: LibraryItem[];
  lessons: VideoLesson[];
}

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "error"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

const CATEGORY_COLOUR: Record<string, string> = {
  English: "bg-blue-50 text-blue-700",
  Science: "bg-green-50 text-green-700",
  Math: "bg-orange-50 text-orange-700",
  Coding: "bg-violet-50 text-violet-700",
  Leadership: "bg-pink-50 text-pink-700",
};

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  // Google Drive
  const drive = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return null;
}

function WeekPanel({ week, materials, lessons }: {
  week: number;
  materials: LibraryItem[];
  lessons: VideoLesson[];
}) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const reading = materials.find((m) => m.weekNumber === week);
  const video = lessons.find((v) => v.weekNumber === week);
  const embedUrl = video ? getYouTubeEmbedUrl(video.videoUrl) : null;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-border bg-brand-lavender-light/30">
        <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {week}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brand-purple uppercase tracking-wide">Week {week}</p>
          <p className="text-sm font-semibold text-foreground truncate">
            {reading?.title.replace(/^Week \d+:\s*/, "") ?? `Week ${week}`}
          </p>
        </div>
        <div className="flex gap-1.5">
          {video && (
            <span className="flex items-center gap-1 text-xs text-muted bg-white border border-border rounded-full px-2.5 py-1">
              <PlayCircle size={11} className="text-brand-purple" />
              Video
            </span>
          )}
          {reading && (
            <span className="flex items-center gap-1 text-xs text-muted bg-white border border-border rounded-full px-2.5 py-1">
              <BookOpen size={11} className="text-brand-purple" />
              Reading
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Video section */}
        {video && (
          <div>
            <button
              onClick={() => setVideoOpen(!videoOpen)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                  <PlayCircle size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-brand-purple transition-colors">
                    {video.title.replace(/^Week \d+:\s*/, "")}
                  </p>
                  {video.duration && (
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Clock size={10} /> {video.duration}
                    </p>
                  )}
                </div>
              </div>
              {videoOpen ? (
                <ChevronUp size={16} className="text-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-muted flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {videoOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-3"
                >
                  {embedUrl ? (
                    <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                      />
                    </div>
                  ) : (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-brand-purple hover:underline"
                    >
                      Open video <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {video && reading && <div className="border-t border-border" />}

        {/* Reading section */}
        {reading && (
          <div>
            <button
              onClick={() => setReadingOpen(!readingOpen)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-lavender-light rounded-xl flex items-center justify-center">
                  <BookOpen size={16} className="text-brand-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-brand-purple transition-colors">
                    Reading Material
                  </p>
                  <p className="text-xs text-muted">Full lesson notes + exercises</p>
                </div>
              </div>
              {readingOpen ? (
                <ChevronUp size={16} className="text-muted flex-shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-muted flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {readingOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="bg-gray-50 rounded-xl p-5 prose prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-code:bg-brand-lavender-light prose-code:text-brand-purple prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-table:text-sm prose-th:bg-brand-lavender-light prose-th:text-brand-purple">
                    <ReactMarkdown>{reading.content}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export function CourseDetail({ course }: { course: Course }) {
  const weeks = Array.from({ length: course.totalWeeks }, (_, i) => i + 1);
  const categoryColour = CATEGORY_COLOUR[course.category] ?? "bg-gray-50 text-gray-700";

  const videoCount = course.lessons.length;
  const readingCount = course.materials.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-purple transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back to Library
      </Link>

      {/* Course header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-start gap-5 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-lavender-light flex items-center justify-center text-3xl flex-shrink-0">
            {course.imageEmoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", categoryColour)}>
                {course.category}
              </span>
              <Badge variant={DIFFICULTY_VARIANT[course.difficulty] ?? "default"}>
                {course.difficulty}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
              {course.title}
            </h1>
            <p className="text-muted text-sm leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock size={14} className="text-brand-purple" />
            <span><strong className="text-foreground">{course.totalWeeks}</strong> weeks</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <PlayCircle size={14} className="text-brand-purple" />
            <span><strong className="text-foreground">{videoCount}</strong> video lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <BookOpen size={14} className="text-brand-purple" />
            <span><strong className="text-foreground">{readingCount}</strong> reading materials</span>
          </div>
        </div>
      </motion.div>

      {/* Weekly breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Course Content</h2>
        {weeks.map((week, i) => (
          <motion.div
            key={week}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <WeekPanel
              week={week}
              materials={course.materials}
              lessons={course.lessons}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
