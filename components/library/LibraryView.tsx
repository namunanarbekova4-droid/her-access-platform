"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Download, BookOpen } from "lucide-react";
import type { LibraryResource } from "@/types";

// ── Hardcoded resource catalogue ──────────────────────────────────────────────
const ALL_RESOURCES: LibraryResource[] = [
  {
    id: "en-1",
    title: "Grammar Fundamentals",
    description:
      "Master the building blocks of English: nouns, verbs, tenses, and sentence structure with clear, practical examples.",
    category: "English",
    content: "",
    language: "English",
    duration: "4 weeks",
    difficulty: "Beginner",
  },
  {
    id: "en-2",
    title: "Business English",
    description:
      "Professional communication skills for emails, meetings, negotiations, and presentations in a global workplace.",
    category: "English",
    content: "",
    language: "English",
    duration: "6 weeks",
    difficulty: "Intermediate",
  },
  {
    id: "en-3",
    title: "IELTS Preparation",
    description:
      "Structured preparation for all four IELTS modules — listening, reading, writing, and speaking — with practice tests.",
    category: "English",
    content: "",
    language: "English",
    duration: "8 weeks",
    difficulty: "Advanced",
  },
  {
    id: "sci-1",
    title: "Biology Basics",
    description:
      "Explore the science of life: cells, genetics, ecosystems, and the human body explained simply and visually.",
    category: "Science",
    content: "",
    language: "English",
    duration: "5 weeks",
    difficulty: "Beginner",
  },
  {
    id: "sci-2",
    title: "Chemistry 101",
    description:
      "Atoms, molecules, reactions, and the periodic table — foundational chemistry that connects to everyday life.",
    category: "Science",
    content: "",
    language: "English",
    duration: "5 weeks",
    difficulty: "Beginner",
  },
  {
    id: "sci-3",
    title: "Physics for Beginners",
    description:
      "Understand forces, motion, energy, and light. Real-world examples make abstract concepts click.",
    category: "Science",
    content: "",
    language: "English",
    duration: "6 weeks",
    difficulty: "Beginner",
  },
  {
    id: "math-1",
    title: "Algebra Foundation",
    description:
      "From variables to equations — build the mathematical thinking skills that underpin science, coding, and finance.",
    category: "Math",
    content: "",
    language: "English",
    duration: "4 weeks",
    difficulty: "Beginner",
  },
  {
    id: "math-2",
    title: "Statistics Intro",
    description:
      "Learn to collect, analyse, and interpret data. Essential skills for research, business, and informed decision-making.",
    category: "Math",
    content: "",
    language: "English",
    duration: "4 weeks",
    difficulty: "Intermediate",
  },
  {
    id: "code-1",
    title: "Python Basics",
    description:
      "Write your first programs in one of the world's most powerful languages. Variables, loops, functions — no experience needed.",
    category: "Coding",
    content: "",
    language: "English",
    duration: "6 weeks",
    difficulty: "Beginner",
  },
  {
    id: "code-2",
    title: "Web Development Intro",
    description:
      "Build real websites with HTML, CSS, and JavaScript. Go from zero to publishing your own page online.",
    category: "Coding",
    content: "",
    language: "English",
    duration: "8 weeks",
    difficulty: "Beginner",
  },
  {
    id: "lead-1",
    title: "Public Speaking",
    description:
      "Overcome fear and communicate with confidence. Practical techniques for speeches, interviews, and everyday conversations.",
    category: "Leadership",
    content: "",
    language: "English",
    duration: "3 weeks",
    difficulty: "Beginner",
  },
  {
    id: "lead-2",
    title: "Goal Setting",
    description:
      "Turn big dreams into achievable plans. Learn SMART goals, habit formation, and the mindset of consistent progress.",
    category: "Leadership",
    content: "",
    language: "English",
    duration: "2 weeks",
    difficulty: "Beginner",
  },
];

type Category = "All" | "English" | "Science" | "Math" | "Coding" | "Leadership";

const CATEGORIES: Category[] = [
  "All",
  "English",
  "Science",
  "Math",
  "Coding",
  "Leadership",
];

const CATEGORY_EMOJIS: Record<string, string> = {
  English: "📖",
  Science: "🔬",
  Math: "📐",
  Coding: "💻",
  Leadership: "🌟",
};

const DIFFICULTY_VARIANT: Record<
  string,
  "success" | "warning" | "error" | "default"
> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

// ── Resource card ─────────────────────────────────────────────────────────────
function ResourceCard({ resource }: { resource: LibraryResource }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Saved for offline access!", {
      icon: "📥",
      style: {
        borderRadius: "16px",
        background: "#3B1347",
        color: "#fff",
      },
    });
  };

  const emoji = CATEGORY_EMOJIS[resource.category] ?? "📚";

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-xl flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
            {resource.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="lavender">{resource.category}</Badge>
            {resource.difficulty && (
              <Badge
                variant={
                  DIFFICULTY_VARIANT[resource.difficulty] ?? "default"
                }
              >
                {resource.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed flex-1 mb-4">
        {resource.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        {resource.duration && (
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <BookOpen size={12} className="text-brand-purple" />
            <span>{resource.duration}</span>
          </div>
        )}
        <Button
          variant={saved ? "secondary" : "ghost"}
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className="text-xs ml-auto"
        >
          <Download size={12} />
          {saved ? "Saved" : "Save Offline"}
        </Button>
      </div>
    </Card>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function LibraryView() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = ALL_RESOURCES.filter((r) => {
    const matchesCategory =
      activeCategory === "All" || r.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
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
          Curated lessons you can save and study anywhere — even offline.
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
            placeholder="Search lessons…"
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeCategory === cat
                ? "bg-brand-purple text-white border-brand-purple shadow-soft"
                : "bg-white text-muted border-border hover:border-brand-purple/50 hover:text-brand-purple"
            }`}
          >
            {cat !== "All" && (
              <span className="mr-1.5">{CATEGORY_EMOJIS[cat]}</span>
            )}
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Resource grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              emoji="🔍"
              title="No lessons found"
              description={
                query
                  ? `No results for "${query}". Try a different search term or category.`
                  : "No lessons in this category yet. Check back soon!"
              }
              action={
                query || activeCategory !== "All" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
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
            {filtered.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
