"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  X,
  Send,
  Users,
  Lock,
  AlertCircle,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import type { Circle, CirclePost } from "@/types";

// ── API response shapes ───────────────────────────────────────────────────────
interface CircleRaw {
  id: string;
  name: string;
  description?: string | null;
  topic: string;
  maxMembers: number;
  _count: { members: number };
  members: Array<{ id: string; nickname: string }>;
}

interface CirclesApiResponse {
  circles?: CircleRaw[];
  error?: string;
}

interface PostsApiResponse {
  posts?: Array<{
    id: string;
    nickname: string;
    content: string;
    createdAt: string;
  }>;
  error?: string;
}

interface JoinApiResponse {
  member?: { id: string; nickname: string };
  error?: string;
}

interface PostApiResponse {
  post?: { id: string; nickname: string; content: string; createdAt: string };
  error?: string;
}

// ── Topic emoji map ───────────────────────────────────────────────────────────
const TOPIC_EMOJIS: Record<string, string> = {
  study: "📚",
  coding: "💻",
  english: "🌍",
  science: "🔬",
  math: "📐",
  leadership: "🌟",
  career: "💼",
  health: "💚",
  arts: "🎨",
  finance: "💰",
  default: "💬",
};

function getTopicEmoji(topic: string): string {
  const key = topic.toLowerCase();
  for (const [k, v] of Object.entries(TOPIC_EMOJIS)) {
    if (key.includes(k)) return v;
  }
  return TOPIC_EMOJIS.default;
}

// ── Chat panel ────────────────────────────────────────────────────────────────
function ChatPanel({
  circle,
  onClose,
}: {
  circle: Circle & { joined: boolean };
  onClose: () => void;
}) {
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`);
      const data = (await res.json()) as PostsApiResponse;
      if (!res.ok) {
        setPostsError(data.error ?? "Failed to load messages.");
        return;
      }
      setPosts(
        (data.posts ?? []).map((p) => ({
          id: p.id,
          nickname: p.nickname,
          content: p.content,
          createdAt: new Date(p.createdAt),
        }))
      );
    } catch {
      setPostsError("Network error. Could not load messages.");
    } finally {
      setLoadingPosts(false);
    }
  }, [circle.id]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = (await res.json()) as PostApiResponse;
      if (res.ok && data.post) {
        setPosts((prev) => [
          ...prev,
          {
            id: data.post!.id,
            nickname: data.post!.nickname,
            content: data.post!.content,
            createdAt: new Date(data.post!.createdAt),
          },
        ]);
        setMessage("");
      }
    } catch {
      // silent — user can retry
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg flex flex-col shadow-glow"
        style={{ maxHeight: "90vh", height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-xl">
            {getTopicEmoji(circle.topic)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground text-sm truncate">
              {circle.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users size={11} className="text-muted" />
              <span className="text-xs text-muted">
                {circle.memberCount} / {circle.maxMembers} members
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-gray-light flex items-center justify-center text-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Privacy note */}
        <div className="mx-4 mt-3 mb-1 flex-shrink-0">
          <div className="flex items-center gap-2 bg-brand-lavender-light rounded-2xl px-3 py-2">
            <Lock size={12} className="text-brand-purple flex-shrink-0" />
            <p className="text-xs text-brand-purple">
              All messages are anonymous. Be kind and supportive.
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loadingPosts && (
            <div className="space-y-3 pt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-gray animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-brand-gray rounded animate-pulse w-1/4" />
                    <div className="h-4 bg-brand-gray-light rounded animate-pulse w-full" />
                    <div className="h-4 bg-brand-gray-light rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {postsError && !loadingPosts && (
            <div className="flex flex-col items-center gap-3 py-6">
              <AlertCircle size={28} className="text-error" />
              <p className="text-sm text-muted text-center">{postsError}</p>
              <Button variant="outline" size="sm" onClick={() => void fetchPosts()}>
                <RefreshCw size={13} />
                Retry
              </Button>
            </div>
          )}

          {!loadingPosts && !postsError && posts.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10">
              <div className="text-4xl">💬</div>
              <p className="text-sm font-medium text-foreground">
                Be the first to say hello!
              </p>
              <p className="text-xs text-muted text-center max-w-xs">
                This circle is quiet. Start the conversation — your message will appear anonymously.
              </p>
            </div>
          )}

          {!loadingPosts &&
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-brand-lavender flex items-center justify-center text-xs font-bold text-brand-purple flex-shrink-0 mt-0.5">
                  {post.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-brand-purple">
                      {post.nickname}
                    </span>
                    <span className="text-xs text-muted">
                      {formatTime(post.createdAt)}
                    </span>
                  </div>
                  <div className="bg-brand-gray-light rounded-2xl rounded-tl-none px-3 py-2">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

          <div ref={bottomRef} />
        </div>

        {/* Message input */}
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share something kind…"
              rows={1}
              disabled={sending}
              maxLength={500}
              className="flex-1 px-3 py-2.5 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <Button
              onClick={() => void handleSend()}
              disabled={!message.trim() || sending}
              loading={sending}
              size="sm"
              className="flex-shrink-0 h-11 w-11 p-0 rounded-2xl"
            >
              <Send size={15} />
            </Button>
          </div>
          <p className="text-xs text-muted mt-1.5 text-right">
            {message.length}/500
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Circle card ───────────────────────────────────────────────────────────────
function CircleCard({
  circle,
  onJoin,
  onOpen,
  joiningId,
}: {
  circle: Circle & { joined: boolean; nickname?: string };
  onJoin: (id: string) => void;
  onOpen: (circle: Circle & { joined: boolean }) => void;
  joiningId: string | null;
}) {
  const isFull = circle.memberCount >= circle.maxMembers;
  const isJoining = joiningId === circle.id;
  const pct = Math.round((circle.memberCount / circle.maxMembers) * 100);

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-2xl flex-shrink-0">
          {getTopicEmoji(circle.topic)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug">
            {circle.name}
          </h3>
          {circle.description && (
            <p className="text-xs text-muted mt-0.5 line-clamp-2">
              {circle.description}
            </p>
          )}
        </div>
      </div>

      {/* Member count + fill bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Users size={12} />
            <span>
              {circle.memberCount} / {circle.maxMembers}
            </span>
          </div>
          <span
            className={`text-xs font-medium ${
              isFull ? "text-error" : "text-success"
            }`}
          >
            {isFull ? "Full" : "Open"}
          </span>
        </div>
        <div className="h-1.5 bg-brand-gray-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? "bg-error" : "bg-brand-purple"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        {circle.joined ? (
          <>
            <span className="flex items-center gap-1 text-xs font-medium text-success bg-green-50 px-2.5 py-1.5 rounded-full">
              Joined ✓
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto"
              onClick={() => onOpen(circle)}
            >
              <MessageCircle size={13} />
              Open Circle
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            loading={isJoining}
            disabled={isFull || isJoining}
            onClick={() => onJoin(circle.id)}
          >
            {isFull ? "Circle Full" : "Join Circle"}
          </Button>
        )}
      </div>
    </Card>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function CirclesView() {
  const [circles, setCircles] = useState<
    Array<Circle & { joined: boolean; nickname?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [openCircle, setOpenCircle] = useState<
    (Circle & { joined: boolean }) | null
  >(null);

  const fetchCircles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/circles");
      const data = (await res.json()) as CirclesApiResponse;
      if (!res.ok) {
        setError(data.error ?? "Failed to load circles.");
        return;
      }
      setCircles(
        (data.circles ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description ?? undefined,
          topic: c.topic,
          maxMembers: c.maxMembers,
          memberCount: c._count.members,
          joined: c.members.length > 0,
          nickname: c.members[0]?.nickname,
        }))
      );
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCircles();
  }, [fetchCircles]);

  const handleJoin = async (circleId: string) => {
    setJoiningId(circleId);
    try {
      const res = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId }),
      });
      const data = (await res.json()) as JoinApiResponse;
      if (res.ok && data.member) {
        setCircles((prev) =>
          prev.map((c) =>
            c.id === circleId
              ? {
                  ...c,
                  joined: true,
                  memberCount: c.memberCount + 1,
                  nickname: data.member?.nickname,
                }
              : c
          )
        );
      }
    } catch {
      // silent — user sees button unchanged
    } finally {
      setJoiningId(null);
    }
  };

  const handleOpen = (circle: Circle & { joined: boolean }) => {
    setOpenCircle(circle);
  };

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
          Peer Circles
        </h1>
        <p className="text-muted text-sm">
          Join a small, anonymous group. Share, learn, and support each other.
        </p>
      </motion.div>

      {/* Privacy notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-start gap-3 bg-brand-lavender-light rounded-3xl px-5 py-4 border border-brand-lavender">
          <Lock size={16} className="text-brand-purple flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-purple">
            <span className="font-semibold">Your privacy is protected.</span>{" "}
            All posts appear under an anonymous nickname. No real names are ever shown.
          </p>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-brand-lavender-light border border-brand-lavender rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle className="text-brand-purple flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-brand-purple mb-1">Circles are taking a moment to load</p>
            <p className="text-sm text-muted mb-4">This sometimes happens on first visit. Tap retry and they should appear.</p>
            <Button variant="outline" size="sm" onClick={() => void fetchCircles()}>
              <RefreshCw size={14} />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && circles.length === 0 && (
        <EmptyState
          emoji="👭"
          title="No circles available yet"
          description="Circles are being created. Check back soon — a supportive community is coming!"
        />
      )}

      {/* Grid */}
      {!loading && !error && circles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map((circle, i) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <CircleCard
                circle={circle}
                onJoin={handleJoin}
                onOpen={handleOpen}
                joiningId={joiningId}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Chat modal */}
      <AnimatePresence>
        {openCircle && (
          <ChatPanel
            circle={openCircle}
            onClose={() => setOpenCircle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
