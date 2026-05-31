"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";
import { Send, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/types";

const SUGGESTED_PROMPTS = [
  "Create a study plan for me",
  "Explain what machine learning is",
  "How do I improve my English?",
  "Motivate me to keep learning",
  "What career paths are available to me?",
  "Help me learn coding basics",
];

export function MentorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        // silent fail — start fresh
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
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
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
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const isFirstMessage = messages.length === 0;

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-lg">
            🌸
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Noor</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-muted">Your AI Mentor · Always here for you</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-brand-purple transition-colors"
          >
            <RefreshCw size={14} />
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {isFirstMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Welcome message */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🌸</div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Hello! I&apos;m Noor
              </h2>
              <p className="text-muted text-sm max-w-md mx-auto">
                Your personal AI mentor. I&apos;m here to teach, guide, and
                encourage you — in your language, at your pace.
              </p>
            </div>

            {/* Suggested prompts */}
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3 text-center">
                Start with a question
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                    className="flex items-center gap-2 text-left px-4 py-3 rounded-2xl border border-border bg-white hover:border-brand-purple/50 hover:bg-brand-lavender-light transition-all text-sm text-foreground group"
                  >
                    <Sparkles size={14} className="text-brand-purple flex-shrink-0 group-hover:scale-110 transition-transform" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-3xl mx-auto ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-gradient-brand text-white"
                    : "bg-brand-lavender text-brand-purple"
                }`}
              >
                {message.role === "assistant" ? "🌸" : "✨"}
              </div>

              <div
                className={`flex-1 max-w-[75%] ${
                  message.role === "user" ? "flex flex-col items-end" : ""
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-brand-purple text-white rounded-tr-none"
                      : "bg-white border border-border rounded-tl-none shadow-soft"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-brand-purple">{children}</strong>,
                        code: ({ children }) => <code className="bg-brand-lavender-light px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
                <p className="text-xs text-muted mt-1 px-1">
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-3xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-sm flex-shrink-0">
              🌸
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-soft">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-border bg-white">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Noor anything..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all max-h-32"
            style={{ minHeight: "48px" }}
            disabled={loading}
          />
          <Button
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || loading}
            size="md"
            className="flex-shrink-0 h-12 w-12 p-0 rounded-2xl"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-muted text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
