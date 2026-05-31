"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MessageCircle,
  BookOpen,
  Library,
  Users,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface DashboardContentProps {
  greeting: string;
  hasProfile: boolean;
  goals: string | null;
}

const quickActions = [
  {
    href: "/mentor",
    icon: MessageCircle,
    label: "Talk to Noor",
    description: "Your AI mentor is ready",
    color: "bg-purple-50 text-brand-purple",
    bgGradient: "from-purple-50 to-brand-lavender-light",
  },
  {
    href: "/learning",
    icon: BookOpen,
    label: "Learning Path",
    description: "Continue your roadmap",
    color: "bg-blue-50 text-blue-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    href: "/library",
    icon: Library,
    label: "Quiet Library",
    description: "Offline lessons",
    color: "bg-green-50 text-green-600",
    bgGradient: "from-green-50 to-emerald-50",
  },
  {
    href: "/circles",
    icon: Users,
    label: "Peer Circles",
    description: "Connect anonymously",
    color: "bg-pink-50 text-pink-600",
    bgGradient: "from-pink-50 to-rose-50",
  },
  {
    href: "/stories",
    icon: Star,
    label: "Stories",
    description: "Be inspired today",
    color: "bg-amber-50 text-amber-600",
    bgGradient: "from-amber-50 to-yellow-50",
  },
];

export function DashboardContent({
  greeting,
  hasProfile,
  goals,
}: DashboardContentProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
          {greeting} 🌸
        </h1>
        <p className="text-muted text-sm">
          {goals
            ? `Continuing your journey in: ${goals.split(", ").slice(0, 2).join(", ")}`
            : "Ready to learn something amazing today?"}
        </p>
      </motion.div>

      {/* Setup prompt */}
      {!hasProfile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-3xl p-6 flex items-center gap-4">
            <Sparkles className="text-brand-lavender flex-shrink-0" size={28} />
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">
                Complete your profile to unlock your AI mentor
              </p>
              <p className="text-white/70 text-sm">
                Tell us your goals and we&apos;ll create your personalized learning path
              </p>
            </div>
            <Link href="/onboarding">
              <Button variant="secondary" size="sm">
                Set up
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* AI Mentor highlight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <Link href="/mentor">
          <div className="bg-gradient-to-br from-brand-purple to-brand-purple-light rounded-3xl p-6 cursor-pointer hover:shadow-glow transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-lavender/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                🌸
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">Noor — Your AI Mentor</span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                </div>
                <p className="text-white/70 text-sm">
                  Ready to help you learn, plan, and grow. Ask me anything!
                </p>
              </div>
              <ArrowRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick actions grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Explore
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Link href={action.href}>
                  <div
                    className={`bg-gradient-to-br ${action.bgGradient} rounded-2xl p-4 border border-border hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}
                    >
                      <Icon size={18} />
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Daily inspiration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-brand-lavender-light to-white">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💫</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Today&apos;s Thought
              </h3>
              <p className="text-sm text-muted italic leading-relaxed">
                &ldquo;Every expert was once a beginner. Every achievement begins with the courage to try.&rdquo;
              </p>
              <Link href="/stories">
                <p className="text-xs text-brand-purple font-medium mt-3 hover:underline">
                  Read more stories →
                </p>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
