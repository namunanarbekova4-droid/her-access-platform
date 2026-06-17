"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";
import {
  ChevronLeft,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  Download,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

interface AiLesson {
  id: string;
  title: string;
  content: string | null;
  examples?: string[];
  key_takeaways?: string[];
  assignment?: string;
  quiz?: QuizQuestion[];
  downloadable_summary?: string;
}

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
  language?: string;
  aiLessons: unknown[] | null;
  materials: LibraryItem[];
  videoLessons: VideoLesson[];
}

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "error"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

const CATEGORY_COLOUR: Record<string, string> = {
  "Language & Literacy": "bg-blue-50 text-blue-700",
  "Digital Skills": "bg-cyan-50 text-cyan-700",
  "Financial Literacy": "bg-emerald-50 text-emerald-700",
  "Health & Rights": "bg-rose-50 text-rose-700",
  "Career Skills": "bg-amber-50 text-amber-700",
  English: "bg-blue-50 text-blue-700",
  Science: "bg-green-50 text-green-700",
  Math: "bg-orange-50 text-orange-700",
  Coding: "bg-violet-50 text-violet-700",
  Leadership: "bg-pink-50 text-pink-700",
};

function embedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const drive = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return null;
}

function QuizSection({ quiz }: { quiz: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? quiz.filter((q, i) => answers[i] === q.correct_answer).length
    : 0;

  return (
    <div className="space-y-4">
      {quiz.map((q, qi) => (
        <div key={qi} className="bg-white border border-border rounded-xl p-4">
          <p className="text-sm font-medium text-foreground mb-3">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const letter = opt.charAt(0);
              const isSelected = answers[qi] === letter;
              const isCorrect = q.correct_answer === letter;
              let cls = "flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all";
              if (!submitted) {
                cls += isSelected
                  ? " border-brand-purple bg-brand-lavender-light text-brand-purple"
                  : " border-border hover:border-brand-purple/40 hover:bg-gray-50";
              } else {
                if (isCorrect) cls += " border-green-300 bg-green-50 text-green-700";
                else if (isSelected) cls += " border-red-300 bg-red-50 text-red-600";
                else cls += " border-border text-muted";
              }
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: letter }))}
                  className={cls}
                >
                  {submitted && isCorrect && <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < quiz.length}
          className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-sm font-medium disabled:opacity-40 hover:bg-brand-purple/90 transition-colors"
        >
          Submit Quiz
        </button>
      ) : (
        <div className={cn(
          "text-center py-3 rounded-xl text-sm font-medium",
          score === quiz.length ? "bg-green-50 text-green-700" : score >= quiz.length / 2 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
        )}>
          {score === quiz.length ? "Perfect score! 🎉" : `${score}/${quiz.length} correct`}
          {score < quiz.length && (
            <button
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="ml-3 text-xs underline opacity-70 hover:opacity-100"
            >Try again</button>
          )}
        </div>
      )}
    </div>
  );
}

function AiLessonAccordion({ lesson, index }: { lesson: AiLesson; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{lesson.title}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-muted flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 border-t border-border space-y-6 pt-5">
              {/* Main content */}
              {lesson.content && (
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-gray-600 prose-li:marker:text-brand-purple">
                  <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
              )}

              {/* Examples */}
              {lesson.examples && lesson.examples.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-amber-500" />
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Real-World Examples</h4>
                  </div>
                  <div className="space-y-2">
                    {lesson.examples.map((ex, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-900">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key takeaways */}
              {lesson.key_takeaways && lesson.key_takeaways.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Key Takeaways</h4>
                  </div>
                  <ul className="space-y-2">
                    {lesson.key_takeaways.map((kt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        {kt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assignment */}
              {lesson.assignment && (
                <div className="bg-brand-lavender-light rounded-xl p-4 border border-brand-purple/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList size={14} className="text-brand-purple" />
                    <h4 className="text-xs font-semibold text-brand-purple uppercase tracking-wide">Your Assignment</h4>
                  </div>
                  <p className="text-sm text-gray-700">{lesson.assignment}</p>
                </div>
              )}

              {/* Quiz */}
              {lesson.quiz && lesson.quiz.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={14} className="text-brand-purple" />
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Quick Quiz</h4>
                  </div>
                  <QuizSection quiz={lesson.quiz} />
                </div>
              )}

              {/* Downloadable summary */}
              {lesson.downloadable_summary && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Download size={14} className="text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Summary (save or print)</h4>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{lesson.downloadable_summary}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GeneratingLessons({ courseId, onDone }: { courseId: string; onDone: (lessons: AiLesson[]) => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons`, { method: "POST" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; lessons?: AiLesson[] }) => {
        if (d.ok && d.lessons) onDone(d.lessons);
        else setError("Could not generate lessons. Please try again.");
      })
      .catch(() => setError("Network error. Please try again."));
  }, [courseId, onDone]);

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
        <XCircle size={28} className="mx-auto text-red-400 mb-3" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-purple-100">
      <Sparkles size={28} className="mx-auto text-brand-purple animate-pulse mb-3" />
      <p className="text-sm font-medium text-brand-purple">Preparing your lesson content…</p>
      <p className="text-xs text-muted mt-1">This only takes a few seconds</p>
    </div>
  );
}

function OldWeekPanel({ week, materials, videoLessons }: {
  week: number;
  materials: LibraryItem[];
  videoLessons: VideoLesson[];
}) {
  const [readingOpen, setReadingOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const reading = materials.find((m) => m.weekNumber === week);
  const video = videoLessons.find((v) => v.weekNumber === week);
  const embed = video ? embedUrl(video.videoUrl) : null;

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
          {video && <span className="flex items-center gap-1 text-xs text-muted bg-white border border-border rounded-full px-2.5 py-1"><PlayCircle size={11} className="text-brand-purple" />Video</span>}
          {reading && <span className="flex items-center gap-1 text-xs text-muted bg-white border border-border rounded-full px-2.5 py-1"><BookOpen size={11} className="text-brand-purple" />Reading</span>}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {video && (
          <div>
            <button onClick={() => setVideoOpen(!videoOpen)} className="flex items-center justify-between w-full text-left group">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center"><PlayCircle size={16} className="text-red-500" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-brand-purple transition-colors">{video.title.replace(/^Week \d+:\s*/, "")}</p>
                  {video.duration && <p className="text-xs text-muted">{video.duration}</p>}
                </div>
              </div>
              {videoOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
            </button>
            <AnimatePresence>
              {videoOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden mt-3">
                  {embed
                    ? <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black"><iframe src={embed} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                    : <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-purple hover:underline">Open video <ExternalLink size={14} /></a>
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {video && reading && <div className="border-t border-border" />}

        {reading && (
          <div>
            <button onClick={() => setReadingOpen(!readingOpen)} className="flex items-center justify-between w-full text-left group">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-lavender-light rounded-xl flex items-center justify-center"><BookOpen size={16} className="text-brand-purple" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-brand-purple transition-colors">Reading Material</p>
                  <p className="text-xs text-muted">Lesson notes + exercises</p>
                </div>
              </div>
              {readingOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
            </button>
            <AnimatePresence>
              {readingOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden mt-3">
                  <div className="bg-gray-50 rounded-xl p-5 prose prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-p:text-muted prose-p:leading-relaxed prose-strong:text-foreground prose-code:bg-brand-lavender-light prose-code:text-brand-purple prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-table:text-sm prose-th:bg-brand-lavender-light prose-th:text-brand-purple">
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
  const [aiLessons, setAiLessons] = useState<AiLesson[] | null>(() => {
    if (!course.aiLessons || !Array.isArray(course.aiLessons)) return null;
    return course.aiLessons as AiLesson[];
  });

  const categoryColour = CATEGORY_COLOUR[course.category] ?? "bg-gray-50 text-gray-700";

  // Determine if AI lessons have real content or are just stubs
  const hasAiContent = aiLessons && aiLessons.length > 0 && aiLessons[0]?.content != null;
  const isGenerating = aiLessons && aiLessons.length > 0 && !hasAiContent;
  const useOldStructure = !aiLessons || aiLessons.length === 0;

  const lessonCount = hasAiContent ? aiLessons!.length : course.materials.length;
  const videoCount = course.videoLessons.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <Link href="/library" className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-purple transition-colors mb-6">
        <ChevronLeft size={16} />
        Back to Library
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
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
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">{course.title}</h1>
            <p className="text-muted text-sm leading-relaxed">{course.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-border text-sm text-muted">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-brand-purple" />
            <span><strong className="text-foreground">{lessonCount}</strong> lessons</span>
          </div>
          {videoCount > 0 && (
            <div className="flex items-center gap-2">
              <PlayCircle size={14} className="text-brand-purple" />
              <span><strong className="text-foreground">{videoCount}</strong> videos</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Course Content</h2>

        {isGenerating && (
          <GeneratingLessons courseId={course.id} onDone={(lessons) => setAiLessons(lessons)} />
        )}

        {hasAiContent && aiLessons!.map((lesson, i) => (
          <motion.div key={lesson.id ?? i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <AiLessonAccordion lesson={lesson} index={i} />
          </motion.div>
        ))}

        {useOldStructure && Array.from({ length: course.totalWeeks }, (_, i) => i + 1).map((week, i) => (
          <motion.div key={week} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <OldWeekPanel week={week} materials={course.materials} videoLessons={course.videoLessons} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
