"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  BookOpen,
  RefreshCw,
  Calendar,
  Target,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  AlertCircle,
  Settings,
} from "lucide-react";
import type { LearningPath, LearningMilestone } from "@/types";

// ── API response shapes ────────────────────────────────────────────────────
interface LearningPathResponse {
  path?: LearningPath;
  error?: string;
}

// ── Individual milestone card ──────────────────────────────────────────────
function MilestoneCard({
  milestone,
  index,
}: {
  milestone: LearningMilestone;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="relative pl-12"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
        {/* dot */}
        <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-soft z-10">
          {milestone.week}
        </div>
        {/* line extending downward */}
        <div className="flex-1 w-0.5 bg-border mt-1" />
      </div>

      <div className="mb-6">
        <Card hover className="overflow-hidden">
          {/* Card header — always visible */}
          <button
            className="w-full text-left"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-medium text-brand-purple bg-brand-lavender px-2 py-0.5 rounded-full">
                    Week {milestone.week}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {milestone.title}
                </h3>
                <p className="text-sm text-muted mt-1 line-clamp-2">
                  {milestone.description}
                </p>
              </div>
              <div className="flex-shrink-0 mt-1">
                {expanded ? (
                  <ChevronUp size={18} className="text-muted" />
                ) : (
                  <ChevronDown size={18} className="text-muted" />
                )}
              </div>
            </div>
          </button>

          {/* Expandable body */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Topics */}
                  {milestone.topics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Topics
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {milestone.topics.map((topic) => (
                          <Badge key={topic} variant="lavender">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {milestone.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                        Resources
                      </p>
                      <ul className="space-y-1">
                        {milestone.resources.map((resource) => (
                          <li
                            key={resource}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <BookOpen
                              size={14}
                              className="text-brand-purple mt-0.5 flex-shrink-0"
                            />
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Goal */}
                  {milestone.goal && (
                    <div className="flex items-start gap-2 bg-brand-lavender-light rounded-2xl px-4 py-3">
                      <Target
                        size={16}
                        className="text-brand-purple mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-brand-purple mb-0.5">
                          Weekly Goal
                        </p>
                        <p className="text-sm text-foreground">{milestone.goal}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </motion.div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function LearningPathSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="pl-12 relative">
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-brand-gray animate-pulse" />
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────
export function LearningPathView() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noProfile, setNoProfile] = useState(false);

  const fetchPath = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learning-path");
      const data = (await res.json()) as LearningPathResponse;

      if (res.status === 404) {
        setNoProfile(true);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Failed to load your learning path.");
        return;
      }

      if (data.path) {
        setPath(data.path);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPath();
  }, [fetchPath]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const del = await fetch("/api/learning-path", { method: "DELETE" });
      if (!del.ok) {
        setError("Could not reset your plan. Please try again.");
        return;
      }
      await fetchPath();
    } catch {
      setError("Network error while regenerating. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  // ── No profile ────────────────────────────────────────────────────────
  if (noProfile) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <EmptyState
          emoji="🗺️"
          title="Your learning path is waiting"
          description="Complete your profile and we'll build a personalised roadmap just for you."
          action={
            <Link href="/onboarding">
              <Button>
                <Sparkles size={16} />
                Set up my profile
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle className="text-error flex-shrink-0 mt-0.5" size={22} />
          <div className="flex-1">
            <p className="font-semibold text-red-700 mb-1">Something went wrong</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void fetchPath()}>
              <RefreshCw size={14} />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
              {loading ? "Your Learning Path" : (path?.title ?? "Your Learning Path")}
            </h1>
            {!loading && path?.description && (
              <p className="text-muted text-sm max-w-xl">{path.description}</p>
            )}
            {!loading && path && (
              <div className="flex items-center gap-2 mt-2">
                <Clock size={14} className="text-brand-purple" />
                <span className="text-xs text-muted font-medium">
                  {path.totalWeeks} week programme
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings size={14} />
                Edit Profile
              </Button>
            </Link>
            {!loading && path && (
              <Button
                variant="outline"
                size="sm"
                loading={regenerating}
                onClick={() => void handleRegenerate()}
              >
                <RefreshCw size={14} />
                Regenerate Plan
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Milestone timeline */}
      {loading ? (
        <LearningPathSkeleton />
      ) : path && path.milestones.length > 0 ? (
        <>
          <div className="relative">
            {path.milestones.map((milestone, i) => (
              <MilestoneCard key={milestone.week} milestone={milestone} index={i} />
            ))}
          </div>

          {/* Weekly schedule */}
          {Object.keys(path.weeklySchedule).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-brand-purple" />
                <h2 className="text-lg font-semibold text-foreground">
                  Weekly Schedule
                </h2>
              </div>
              <Card className="bg-gradient-to-br from-brand-lavender-light to-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(path.weeklySchedule).map(([day, activity]) => (
                    <div
                      key={day}
                      className="flex items-start gap-3 bg-white rounded-2xl p-3 border border-border"
                    >
                      <div className="flex-shrink-0 w-20 text-xs font-semibold text-brand-purple capitalize pt-0.5">
                        {day}
                      </div>
                      <p className="text-sm text-foreground">{activity}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      ) : (
        <EmptyState
          emoji="✨"
          title="No milestones yet"
          description="We couldn't build your roadmap right now. Try regenerating your plan."
          action={
            <Button
              loading={regenerating}
              onClick={() => void handleRegenerate()}
            >
              <Sparkles size={16} />
              Generate My Plan
            </Button>
          }
        />
      )}
    </div>
  );
}
