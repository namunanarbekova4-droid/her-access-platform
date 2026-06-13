"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";
import { Send, Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export const TEACHING_MODES = [
  { id: "default", emoji: "🌸", label: "Noor", desc: "Warm, supportive mentor" },
  { id: "explain", emoji: "🔍", label: "Explain", desc: "Break it down simply" },
  { id: "exam", emoji: "📝", label: "Exam Prep", desc: "Quiz and test mode" },
  { id: "stepbystep", emoji: "🪜", label: "Step-by-Step", desc: "One step at a time" },
  { id: "coach", emoji: "🏆", label: "Coach", desc: "High-energy motivation" },
  { id: "homework", emoji: "📚", label: "Homework", desc: "Assignment helper" },
  { id: "language", emoji: "🗣️", label: "Language", desc: "Conversation practice" },
] as const;

export type TeachingModeId = (typeof TEACHING_MODES)[number]["id"];

const SUGGESTED_PROMPTS: Record<TeachingModeId, string[]> = {
  default: [
    "Create a study plan for me",
    "Explain machine learning simply",
    "How do I improve my English?",
    "Motivate me to keep learning",
    "What career paths suit me?",
    "Help me learn coding basics",
  ],
  explain: [
    "Explain photosynthesis in simple terms",
    "What is algebra and why does it matter?",
    "How does the internet actually work?",
    "Explain gravity like I'm 10",
    "What is DNA and what does it do?",
    "Explain supply and demand",
  ],
  exam: [
    "Quiz me on basic biology",
    "Test my English grammar",
    "Give me 5 algebra problems",
    "Ask me about world history",
    "Test my Python knowledge",
    "Quiz me on chemistry basics",
  ],
  stepbystep: [
    "Teach me to write an essay step by step",
    "How do I solve quadratic equations?",
    "Walk me through building a website",
    "How to start learning a new language",
    "Guide me through solving word problems",
    "Teach me Python from the very beginning",
  ],
  coach: [
    "I want to give up — help me",
    "I haven't studied in a week",
    "I failed my test, what now?",
    "Help me believe in myself",
    "I'm scared to try new things",
    "How do I stay consistent?",
  ],
  homework: [
    "Help me understand this math problem",
    "Can you check my essay?",
    "I don't understand this science question",
    "Help me with my English homework",
    "Explain this history topic",
    "What does this word mean?",
  ],
  language: [
    "Let's practice English conversation",
    "Correct my English mistakes gently",
    "Teach me 10 useful English phrases",
    "Help me write a formal email in English",
    "Practice speaking about my day",
    "Help me with pronunciation tips",
  ],
};

export function MentorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<TeachingModeId>("default");
  const [showModes, setShowModes] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentMode = TEACHING_MODES.find((m) => m.id === mode) ?? TEACHING_MODES[0]!;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch("/api/mentor");
        if (res.ok) {
          const data = await res.json() as { messages: Array<{ id: string; role: string; content: string; createdAt: string }> };
          setMessages(
            data.messages.map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
              createdAt: new Date(m.createdAt),
            }))
          );
        }
      } catch {
        // silent fail
      }
    };
    void loadMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          mode,
        }),
      });

      const data = await res.json() as { response?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response ?? "I'm here to help!",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [messages, loading, mode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const isFirstMessage = messages.length === 0;
  const prompts = SUGGESTED_PROMPTS[mode];

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 border-b border-border bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center text-base shadow-soft">
              🌸
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-sm">Noor</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-muted">Your AI Mentor</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode selector button */}
            <button
              onClick={() => setShowModes(!showModes)}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-brand-lavender-light hover:bg-brand-lavender/40 px-3 py-1.5 rounded-xl transition-colors border border-brand-lavender/30"
            >
              <span>{currentMode.emoji}</span>
              <span className="hidden sm:inline">{currentMode.label}</span>
              <ChevronDown size={12} className={cn("transition-transform", showModes && "rotate-180")} />
            </button>

            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-purple transition-colors px-2 py-1.5 rounded-xl hover:bg-brand-lavender-light"
              >
                <RefreshCw size={13} />
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Teaching mode dropdown */}
        <AnimatePresence>
          {showModes && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Teaching Mode</p>
                <div className="flex flex-wrap gap-1.5">
                  {TEACHING_MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id); setShowModes(false); }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                        mode === m.id
                          ? "bg-brand-purple text-white border-brand-purple shadow-soft"
                          : "bg-white text-muted border-border hover:border-brand-purple/40 hover:text-brand-purple"
                      )}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
                {currentMode.desc && (
                  <p className="text-xs text-muted mt-2 italic">{currentMode.emoji} {currentMode.desc}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {isFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-4"
              >
                🌸
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                {mode === "default" ? "Hello! I'm Noor" : `Mode: ${currentMode.label} ${currentMode.emoji}`}
              </h2>
              <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
                {mode === "default"
                  ? "Your personal AI mentor. I'm here to teach, guide, and encourage you — in your language, at your pace."
                  : currentMode.desc}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3 text-center">
                Try asking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                    className="flex items-center gap-2 text-left px-4 py-3 rounded-2xl border border-border bg-white hover:border-brand-purple/50 hover:bg-brand-lavender-light transition-all text-sm text-foreground group"
                  >
                    <Sparkles size={13} className="text-brand-purple flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex gap-3 max-w-3xl mx-auto",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-brand-purple to-brand-purple-light text-white"
                    : "bg-brand-lavender text-brand-purple"
                )}
              >
                {message.role === "assistant" ? "🌸" : "✨"}
              </div>

              <div className={cn("flex-1 max-w-[80%]", message.role === "user" && "flex flex-col items-end")}>
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-brand-purple text-white rounded-tr-none"
                      : "bg-white border border-border rounded-tl-none shadow-soft"
                  )}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-brand-purple">{children}</strong>,
                        code: ({ children }) => <code className="bg-brand-lavender-light px-1.5 py-0.5 rounded text-xs font-mono text-brand-purple">{children}</code>,
                        pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 rounded-xl p-3 text-xs overflow-x-auto mb-2">{children}</pre>,
                        h3: ({ children }) => <h3 className="font-semibold text-foreground mb-1 mt-2">{children}</h3>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-brand-purple/30 pl-3 italic text-muted my-2">{children}</blockquote>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
                <p className="text-xs text-muted mt-1 px-1">{formatTime(message.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-3xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center text-sm flex-shrink-0">
              🌸
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-soft">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-brand-purple/40"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4 flex-shrink-0 text-lg leading-none">✕</button>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-border bg-white">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode === "default" ? "Ask Noor anything…" : `${currentMode.emoji} ${currentMode.label} mode — ask away…`}
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
              style={{ minHeight: "48px", maxHeight: "128px" }}
              disabled={loading}
            />
          </div>
          <Button
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || loading}
            size="md"
            className="flex-shrink-0 h-12 w-12 p-0 rounded-2xl"
          >
            <Send size={17} />
          </Button>
        </div>
        <p className="text-xs text-muted text-center mt-2 opacity-70">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
