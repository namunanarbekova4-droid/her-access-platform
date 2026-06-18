"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  X, Send, Users, Lock, AlertCircle, RefreshCw,
  MessageCircle, Trophy, HelpCircle, ThumbsUp, Sparkles,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Minimal i18n string constants ─────────────────────────────────────────────
const S = {
  title: "Peer Circles",
  subtitle: "Join a small, anonymous group. Share, learn, and support each other.",
  privacyNote: "Your privacy is protected.",
  privacyDetail: "All posts appear under an anonymous nickname. No real names are ever shown.",
  loadingCircles: "Loading circles…",
  circlesSlowTitle: "Circles are taking a moment to load",
  circlesSlowDetail: "This sometimes happens on first visit. Tap retry and they should appear.",
  retry: "Retry",
  noCircles: "No circles available yet",
  noCirclesDetail: "Circles are being set up. Check back soon!",
  joined: "Joined ✓",
  openCircle: "Open",
  joinCircle: "Join Circle",
  circleFull: "Full",
  members: "members",
  membersOf: "/ {max} members",
  anonNote: "All messages are anonymous. Be kind and supportive.",
  beFirst: "Be the first to say hello!",
  beFirstDetail: "Start the conversation — your message appears anonymously.",
  placeholder: "Share something kind…",
  charCount: "{n}/500",
  challenge: "Weekly Challenge 🏆",
  challengeExpires: "Expires in {n} days",
  challengeLoading: "Loading this week's challenge…",
  askCircle: "Ask the Circle ❓",
  askPlaceholder: "Ask something anonymously… (min 5 chars)",
  askSubmit: "Ask",
  askCancel: "Cancel",
  askCharCount: "{n}/300",
  upvotes: "{n} 👍",
  anonymousAsked: "Anonymous asked:",
  herAI: "HerAI 🌸",
  herAILabel: "Community AI",
  toxicError: "This message doesn't meet our community guidelines.",
  sendError: "Could not send message. Try again.",
  full: "Full",
  open: "Open",
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface CircleRaw {
  id: string;
  name: string;
  description?: string | null;
  topic: string;
  emoji: string;
  maxMembers: number;
  _count: { members: number };
  members: Array<{ id: string; nickname: string }>;
}

interface CircleShape {
  id: string;
  name: string;
  description?: string;
  topic: string;
  emoji: string;
  maxMembers: number;
  memberCount: number;
  joined: boolean;
  nickname?: string;
}

interface PostRaw {
  id: string;
  circleId?: string;
  nickname: string;
  content: string;
  type: "message" | "ai" | "question";
  createdAt: string;
}

interface Post {
  id: string;
  nickname: string;
  content: string;
  type: "message" | "ai" | "question";
  createdAt: Date;
}

interface Challenge {
  id: string;
  circleId: string;
  content: string;
  generatedAt: string;
  expiresAt: string;
  winnerPostId?: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── ChallengeCard (Feature 2) ─────────────────────────────────────────────────
function ChallengeCard({ challenge, loading }: { challenge: Challenge | null; loading: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="mx-4 mt-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={14} className="text-brand-purple" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded mb-1" />
        <Skeleton className="h-3 w-3/4 rounded" />
      </div>
    );
  }

  if (!challenge) return null;

  const days = daysUntil(challenge.expiresAt);

  return (
    <div className="mx-4 mt-3">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-brand-purple flex-shrink-0" />
            <span className="text-xs font-semibold text-brand-purple">{S.challenge}</span>
            {days > 0 && (
              <span className="text-xs text-muted ml-1">
                · Expires in {days} {days === 1 ? "day" : "days"}
              </span>
            )}
          </div>
          {collapsed ? <ChevronDown size={13} className="text-muted" /> : <ChevronUp size={13} className="text-muted" />}
        </button>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{challenge.content}</p>
                <p className="text-xs text-muted mt-2">Answer directly in the chat below 💬</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── ReactionBar (Feature 4) ────────────────────────────────────────────────────
const REACTION_EMOJIS = ["🌸", "💜", "🔥", "🙌", "💡", "🤗"] as const;

function ReactionBar({
  postId,
  reactions,
  myReactions,
  onReact,
}: {
  postId: string;
  reactions: Record<string, number>;
  myReactions: string[];
  onReact: (postId: string, emoji: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const hasAny = Object.keys(reactions).length > 0;

  return (
    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
      {/* Existing reaction counts */}
      {Object.entries(reactions).map(([emoji, count]) => (
        <motion.button
          key={emoji}
          whileTap={{ scale: 0.85 }}
          onClick={() => onReact(postId, emoji)}
          className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all",
            myReactions.includes(emoji)
              ? "bg-brand-lavender-light border-brand-purple text-brand-purple font-medium"
              : "bg-white border-border text-muted hover:border-brand-purple/40"
          )}
        >
          <span>{emoji}</span>
          <span>{count}</span>
        </motion.button>
      ))}

      {/* Add reaction toggle */}
      {showAll ? (
        <div className="flex gap-1">
          {REACTION_EMOJIS.map((emoji) => (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.8 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => { onReact(postId, emoji); setShowAll(false); }}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-border hover:bg-brand-lavender-light text-sm transition-all"
            >
              {emoji}
            </motion.button>
          ))}
          <button onClick={() => setShowAll(false)} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-muted text-xs hover:bg-gray-200">
            <X size={11} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAll(true)}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full border text-xs transition-all",
            hasAny ? "bg-white border-border text-muted hover:border-brand-purple/40" : "bg-gray-50 border-dashed border-gray-300 text-gray-400 hover:border-brand-purple/40"
          )}
        >
          {hasAny ? "+" : "🌸"}
        </button>
      )}
    </div>
  );
}

// ── MessageBubble ──────────────────────────────────────────────────────────────
function MessageBubble({
  post,
  reactions,
  myReactions,
  voteCount,
  hasVoted,
  onReact,
  onVote,
}: {
  post: Post;
  reactions: Record<string, number>;
  myReactions: string[];
  voteCount: number;
  hasVoted: boolean;
  onReact: (postId: string, emoji: string) => void;
  onVote: (postId: string) => void;
}) {
  // AI moderator message
  if (post.type === "ai") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
          🌸
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-semibold text-brand-purple">{S.herAI}</span>
            <span className="text-xs text-muted">{formatTime(post.createdAt)}</span>
          </div>
          <div className="bg-gradient-to-r from-brand-lavender-light to-purple-50 border border-purple-100 rounded-2xl rounded-tl-none px-3 py-2">
            <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Anonymous question
  if (post.type === "question") {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="my-2">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <HelpCircle size={13} className="text-brand-purple flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-purple">{S.anonymousAsked}</span>
                <span className="text-xs text-muted ml-auto">{formatTime(post.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">{post.content}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-100">
            <ReactionBar postId={post.id} reactions={reactions} myReactions={myReactions} onReact={onReact} />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote(post.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ml-2 flex-shrink-0",
                hasVoted
                  ? "bg-brand-purple text-white border-brand-purple"
                  : "bg-white border-border text-muted hover:border-brand-purple/50 hover:text-brand-purple"
              )}
            >
              <ThumbsUp size={11} />
              <span>{voteCount > 0 ? voteCount : ""} Helpful</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular message
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-brand-lavender flex items-center justify-center text-xs font-bold text-brand-purple flex-shrink-0 mt-0.5">
        {post.nickname.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-semibold text-brand-purple">{post.nickname}</span>
          <span className="text-xs text-muted">{formatTime(post.createdAt)}</span>
        </div>
        <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 py-2">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{post.content}</p>
        </div>
        <ReactionBar postId={post.id} reactions={reactions} myReactions={myReactions} onReact={onReact} />
      </div>
    </motion.div>
  );
}

// ── ChatPanel ──────────────────────────────────────────────────────────────────
function ChatPanel({
  circle,
  onClose,
}: {
  circle: CircleShape;
  onClose: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<string, string[]>>({});
  const [questionVotes, setQuestionVotes] = useState<Record<string, number>>({});
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [askMode, setAskMode] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load posts + reactions
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`);
      const data = await res.json() as {
        posts?: PostRaw[];
        reactions?: Record<string, Record<string, number>>;
        myReactions?: Record<string, string[]>;
        questionVotes?: Record<string, number>;
        myVotes?: string[];
        error?: string;
      };
      if (!res.ok) { setPostsError(data.error ?? "Failed to load messages."); return; }
      setPosts((data.posts ?? []).map((p) => ({ ...p, createdAt: new Date(p.createdAt), type: p.type ?? "message" })));
      setReactions(data.reactions ?? {});
      setMyReactions(data.myReactions ?? {});
      setQuestionVotes(data.questionVotes ?? {});
      setMyVotes(new Set(data.myVotes ?? []));
    } catch {
      setPostsError("Network error. Could not load messages.");
    } finally {
      setLoadingPosts(false);
    }
  }, [circle.id]);

  // Load challenge
  useEffect(() => {
    fetch(`/api/circles/${circle.id}/challenge`)
      .then((r) => r.json())
      .then((d: { challenge?: Challenge | null }) => setChallenge(d.challenge ?? null))
      .catch(() => setChallenge(null))
      .finally(() => setChallengeLoading(false));
  }, [circle.id]);

  useEffect(() => { void fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // ── Send regular message ────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await res.json() as { post?: PostRaw; error?: string; code?: string };
      if (res.ok && data.post) {
        setPosts((prev) => [...prev, { ...data.post!, createdAt: new Date(data.post!.createdAt), type: "message" }]);
        setMessage("");
        // Reload to get any AI distress response
        if (data.post) {
          setTimeout(() => { void fetchPosts(); }, 600);
        }
      } else {
        setSendError(data.error ?? S.sendError);
      }
    } catch {
      setSendError(S.sendError);
    } finally {
      setSending(false);
    }
  };

  // ── Submit anonymous question ───────────────────────────────────────────────
  const handleAskCircle = async () => {
    const trimmed = questionText.trim();
    if (!trimmed || submittingQuestion) return;
    setSubmittingQuestion(true);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, type: "question" }),
      });
      const data = await res.json() as { post?: PostRaw; error?: string };
      if (res.ok && data.post) {
        setPosts((prev) => [...prev, { ...data.post!, createdAt: new Date(data.post!.createdAt), type: "question" }]);
        setQuestionText("");
        setAskMode(false);
      }
    } catch { /* silent */ } finally {
      setSubmittingQuestion(false);
    }
  };

  // ── React to a message (optimistic) ────────────────────────────────────────
  const handleReact = async (postId: string, emoji: string) => {
    const hasReacted = (myReactions[postId] ?? []).includes(emoji);

    setMyReactions((prev) => {
      const updated = { ...prev };
      updated[postId] = hasReacted
        ? (updated[postId] ?? []).filter((e) => e !== emoji)
        : [...(updated[postId] ?? []), emoji];
      return updated;
    });
    setReactions((prev) => {
      const updated = { ...prev };
      const post = { ...(updated[postId] ?? {}) };
      post[emoji] = (post[emoji] ?? 0) + (hasReacted ? -1 : 1);
      if ((post[emoji] ?? 0) <= 0) delete post[emoji];
      updated[postId] = post;
      return updated;
    });

    try {
      await fetch(`/api/circles/${circle.id}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, emoji }),
      });
    } catch {
      // Revert optimistic update
      setMyReactions((prev) => {
        const updated = { ...prev };
        updated[postId] = hasReacted
          ? [...(updated[postId] ?? []), emoji]
          : (updated[postId] ?? []).filter((e) => e !== emoji);
        return updated;
      });
      setReactions((prev) => {
        const updated = { ...prev };
        const post = { ...(updated[postId] ?? {}) };
        post[emoji] = (post[emoji] ?? 0) + (hasReacted ? 1 : -1);
        if ((post[emoji] ?? 0) <= 0) delete post[emoji];
        updated[postId] = post;
        return updated;
      });
    }
  };

  // ── Vote on question (optimistic) ──────────────────────────────────────────
  const handleVote = async (postId: string) => {
    const hasVoted = myVotes.has(postId);

    setMyVotes((prev) => { const n = new Set(prev); hasVoted ? n.delete(postId) : n.add(postId); return n; });
    setQuestionVotes((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + (hasVoted ? -1 : 1) }));

    try {
      await fetch(`/api/circles/${circle.id}/questions/${postId}/vote`, { method: "POST" });
    } catch {
      // Revert
      setMyVotes((prev) => { const n = new Set(prev); hasVoted ? n.add(postId) : n.delete(postId); return n; });
      setQuestionVotes((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + (hasVoted ? 1 : -1) }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg flex flex-col shadow-2xl"
        style={{ maxHeight: "92vh", height: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-xl flex-shrink-0">
            {circle.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground text-sm truncate">{circle.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users size={11} className="text-muted" />
              <span className="text-xs text-muted">{circle.memberCount} / {circle.maxMembers} members</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Privacy note */}
        <div className="mx-4 mt-3 mb-1 flex-shrink-0">
          <div className="flex items-center gap-2 bg-brand-lavender-light rounded-2xl px-3 py-2">
            <Lock size={11} className="text-brand-purple flex-shrink-0" />
            <p className="text-xs text-brand-purple">{S.anonNote}</p>
          </div>
        </div>

        {/* Challenge card (Feature 2) */}
        <ChallengeCard challenge={challenge} loading={challengeLoading} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          {loadingPosts && (
            <div className="space-y-3 pt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
                    <div className="h-10 bg-gray-100 rounded-2xl animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {postsError && !loadingPosts && (
            <div className="flex flex-col items-center gap-3 py-6">
              <AlertCircle size={24} className="text-brand-purple" />
              <p className="text-sm text-muted text-center">{postsError}</p>
              <Button variant="outline" size="sm" onClick={() => void fetchPosts()}>
                <RefreshCw size={13} /> Retry
              </Button>
            </div>
          )}

          {!loadingPosts && !postsError && posts.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="text-4xl">💬</div>
              <p className="text-sm font-medium text-foreground">{S.beFirst}</p>
              <p className="text-xs text-muted max-w-xs">{S.beFirstDetail}</p>
            </div>
          )}

          {!loadingPosts && posts.map((post) => (
            <MessageBubble
              key={post.id}
              post={post}
              reactions={reactions[post.id] ?? {}}
              myReactions={myReactions[post.id] ?? []}
              voteCount={questionVotes[post.id] ?? 0}
              hasVoted={myVotes.has(post.id)}
              onReact={handleReact}
              onVote={handleVote}
            />
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Send error */}
        {sendError && (
          <div className="mx-4 mb-1 flex-shrink-0">
            <p className="text-xs text-red-500 text-center">{sendError}</p>
          </div>
        )}

        {/* Ask the Circle form (Feature 5) */}
        <AnimatePresence>
          {askMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex-shrink-0"
            >
              <div className="mx-4 mb-2 bg-purple-50 border border-purple-200 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <HelpCircle size={13} className="text-brand-purple" />
                  <span className="text-xs font-semibold text-brand-purple">Ask anonymously</span>
                </div>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder={S.askPlaceholder}
                  rows={2}
                  maxLength={300}
                  className="w-full text-sm bg-white border border-purple-100 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">{questionText.length}/300</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setAskMode(false); setQuestionText(""); }}>
                      {S.askCancel}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={submittingQuestion}
                      disabled={questionText.trim().length < 5 || submittingQuestion}
                      onClick={() => void handleAskCircle()}
                    >
                      {S.askSubmit}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message input */}
        <div className="px-4 py-3 border-t border-border flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); setSendError(null); }}
                onKeyDown={handleKeyDown}
                placeholder={S.placeholder}
                rows={1}
                disabled={sending}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
                style={{ minHeight: "44px", maxHeight: "100px" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Button
                onClick={() => void handleSend()}
                disabled={!message.trim() || sending}
                loading={sending}
                size="sm"
                className="h-11 w-11 p-0 rounded-2xl flex-shrink-0"
              >
                <Send size={15} />
              </Button>
              <button
                onClick={() => { setAskMode(!askMode); setSendError(null); }}
                title={S.askCircle}
                className={cn(
                  "h-11 w-11 flex items-center justify-center rounded-2xl border text-sm transition-all flex-shrink-0",
                  askMode
                    ? "bg-purple-100 border-purple-300 text-brand-purple"
                    : "bg-white border-border text-muted hover:border-brand-purple/50 hover:text-brand-purple"
                )}
              >
                ❓
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <button
              onClick={() => setAskMode(!askMode)}
              className="text-xs text-brand-purple/70 hover:text-brand-purple transition-colors"
            >
              {S.askCircle}
            </button>
            <p className="text-xs text-muted">{message.length}/500</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── CircleCard (Feature 1 — rooms with emoji) ─────────────────────────────────
function CircleCard({
  circle,
  onJoin,
  onOpen,
  joiningId,
}: {
  circle: CircleShape;
  onJoin: (id: string) => void;
  onOpen: (circle: CircleShape) => void;
  joiningId: string | null;
}) {
  const isFull = circle.memberCount >= circle.maxMembers;
  const isJoining = joiningId === circle.id;
  const pct = Math.round((circle.memberCount / circle.maxMembers) * 100);

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-lavender-light flex items-center justify-center text-2xl flex-shrink-0">
          {circle.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug">{circle.name}</h3>
          {circle.description && (
            <p className="text-xs text-muted mt-0.5 line-clamp-2">{circle.description}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Users size={12} />
            <span>{circle.memberCount} / {circle.maxMembers}</span>
          </div>
          <span className={cn("text-xs font-medium", isFull ? "text-red-500" : "text-green-600")}>
            {isFull ? S.full : S.open}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", isFull ? "bg-red-400" : "bg-brand-purple")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        {circle.joined ? (
          <>
            <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full">
              {S.joined}
            </span>
            <Button variant="secondary" size="sm" className="ml-auto" onClick={() => onOpen(circle)}>
              <MessageCircle size={13} />
              {S.openCircle}
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
            {isFull ? S.circleFull : S.joinCircle}
          </Button>
        )}
      </div>
    </Card>
  );
}

// ── CirclesView (main) ─────────────────────────────────────────────────────────
export function CirclesView() {
  const [circles, setCircles] = useState<CircleShape[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [openCircle, setOpenCircle] = useState<CircleShape | null>(null);

  const fetchCircles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/circles");
      const data = await res.json() as { circles?: CircleRaw[]; error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to load circles."); return; }
      setCircles(
        (data.circles ?? []).map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description ?? undefined,
          topic: c.topic,
          emoji: c.emoji || "💬",
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

  useEffect(() => { void fetchCircles(); }, [fetchCircles]);

  const handleJoin = async (circleId: string) => {
    setJoiningId(circleId);
    try {
      const res = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId }),
      });
      const data = await res.json() as { member?: { id: string; nickname: string }; error?: string };
      if (res.ok && data.member) {
        setCircles((prev) =>
          prev.map((c) =>
            c.id === circleId
              ? { ...c, joined: true, memberCount: c.memberCount + 1, nickname: data.member?.nickname }
              : c
          )
        );
      }
    } catch { /* silent */ } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">{S.title}</h1>
        <p className="text-muted text-sm">{S.subtitle}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex items-start gap-3 bg-brand-lavender-light rounded-3xl px-5 py-4 border border-brand-lavender">
          <Lock size={16} className="text-brand-purple flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-purple">
            <span className="font-semibold">{S.privacyNote}</span> {S.privacyDetail}
          </p>
        </div>
      </motion.div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-border p-5">
              <div className="flex gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
              <Skeleton className="h-1.5 w-full rounded-full mb-4" />
              <Skeleton className="h-9 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-brand-lavender-light border border-brand-lavender rounded-3xl p-6 flex items-start gap-4">
          <Sparkles className="text-brand-purple flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-brand-purple mb-1">{S.circlesSlowTitle}</p>
            <p className="text-sm text-muted mb-4">{S.circlesSlowDetail}</p>
            <Button variant="outline" size="sm" onClick={() => void fetchCircles()}>
              <RefreshCw size={14} /> {S.retry}
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && circles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-border">
          <div className="text-4xl mb-3">👭</div>
          <p className="font-semibold text-foreground">{S.noCircles}</p>
          <p className="text-sm text-muted mt-1">{S.noCirclesDetail}</p>
        </div>
      )}

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
                onOpen={(c) => setOpenCircle(c)}
                joiningId={joiningId}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openCircle && (
          <ChatPanel circle={openCircle} onClose={() => setOpenCircle(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
