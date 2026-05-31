"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { X, RefreshCw, Quote, AlertCircle, MapPin } from "lucide-react";
import type { Story } from "@/types";

// ── API shapes ────────────────────────────────────────────────────────────────
interface StoriesApiResponse {
  stories?: Story[];
  error?: string;
}

// ── Field → badge variant map ─────────────────────────────────────────────────
const FIELD_VARIANT: Record<
  string,
  "purple" | "lavender" | "success" | "warning" | "error" | "default"
> = {
  Technology: "purple",
  Medicine: "success",
  "Languages & Business": "lavender",
  Education: "warning",
  Science: "lavender",
  Arts: "error",
  Leadership: "purple",
  Finance: "default",
};

function fieldVariant(
  field: string
): "purple" | "lavender" | "success" | "warning" | "error" | "default" {
  return FIELD_VARIANT[field] ?? "lavender";
}

// ── Expanded story modal ──────────────────────────────────────────────────────
function StoryModal({
  story,
  onClose,
}: {
  story: Story;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl overflow-y-auto shadow-glow"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-brand-purple to-brand-purple-light px-6 py-8 relative rounded-t-3xl sm:rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close story"
          >
            <X size={16} />
          </button>

          <div className="text-5xl mb-4">{story.emoji}</div>
          <Badge variant="lavender" className="mb-3">
            {story.field}
          </Badge>
          <h2 className="text-xl font-display font-bold text-white mb-2 leading-snug">
            {story.title}
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white/80 text-sm font-medium">
              {story.protagonist}
            </span>
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <MapPin size={12} />
              <span>{story.region}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Story content */}
          <p className="text-sm text-foreground leading-relaxed">
            {story.content}
          </p>

          {/* Achievement */}
          {story.achievement && (
            <div className="bg-brand-lavender-light rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-1">
                Achievement
              </p>
              <p className="text-sm text-foreground">{story.achievement}</p>
            </div>
          )}

          {/* Lesson / quote */}
          <div className="flex items-start gap-3">
            <Quote
              size={20}
              className="text-brand-purple flex-shrink-0 mt-0.5"
            />
            <p className="text-base font-semibold text-brand-purple italic leading-snug">
              {story.lesson}
            </p>
          </div>

          <Button variant="outline" size="sm" fullWidth onClick={onClose}>
            Back to Stories
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Story card ────────────────────────────────────────────────────────────────
function StoryCard({
  story,
  index,
  onClick,
}: {
  story: Story;
  index: number;
  onClick: () => void;
}) {
  const excerpt =
    story.content.length > 100
      ? story.content.slice(0, 100).trimEnd() + "…"
      : story.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <button
        className="w-full h-full text-left group focus:outline-none focus:ring-2 focus:ring-brand-purple/40 rounded-3xl"
        onClick={onClick}
        aria-label={`Read story: ${story.title}`}
      >
      <Card
        hover
        glow
        className="flex flex-col h-full"
      >
        {/* Top: emoji + field badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
            {story.emoji}
          </div>
          <Badge variant={fieldVariant(story.field)}>{story.field}</Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">
          {story.title}
        </h3>

        {/* Protagonist + region */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium text-brand-purple">
            {story.protagonist}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={10} />
            <span>{story.region}</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xs text-muted leading-relaxed flex-1 mb-4">
          {excerpt}
        </p>

        {/* Lesson */}
        <div className="border-t border-border pt-3 flex items-start gap-2">
          <Quote size={12} className="text-brand-purple flex-shrink-0 mt-0.5" />
          <p className="text-xs text-brand-purple font-medium italic leading-snug line-clamp-2">
            {story.lesson}
          </p>
        </div>
      </Card>
      </button>
    </motion.div>
  );
}

// ── Skeleton grid ─────────────────────────────────────────────────────────────
function StoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function StoriesView() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Story | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStories = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetch("/api/stories");
      const data = (await res.json()) as StoriesApiResponse;
      if (!res.ok) {
        setError(data.error ?? "Failed to load stories.");
        return;
      }
      setStories(data.stories ?? []);
    } catch {
      setError("Network error. Could not load stories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchStories();
  }, [fetchStories]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
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
              Inspiration Stories
            </h1>
            <p className="text-muted text-sm">
              Real women who built extraordinary lives through learning.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={refreshing}
            onClick={() => void fetchStories(true)}
          >
            <RefreshCw size={14} />
            Refresh Stories
          </Button>
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {loading && <StoriesSkeleton />}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle className="text-error flex-shrink-0 mt-0.5" size={22} />
          <div className="flex-1">
            <p className="font-semibold text-red-700 mb-1">
              Could not load stories
            </p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchStories()}
            >
              <RefreshCw size={14} />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && stories.length === 0 && (
        <EmptyState
          emoji="🌸"
          title="Stories are on their way"
          description="We're gathering inspiring journeys from around the world. Check back in a moment!"
          action={
            <Button
              loading={refreshing}
              onClick={() => void fetchStories(true)}
            >
              <RefreshCw size={15} />
              Try Again
            </Button>
          }
        />
      )}

      {/* Stories grid */}
      {!loading && !error && stories.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={stories.map((s) => s.id).join(",")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {stories.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                index={i}
                onClick={() => setSelected(story)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Expanded story modal */}
      <AnimatePresence>
        {selected && (
          <StoryModal story={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
