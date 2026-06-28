"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  BookOpen,
  Library,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Megaphone,
  Heart,
  Zap,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Confetti } from "@/components/ui/Confetti";
import { t } from "@/lib/translations";

const QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "Every expert was once a beginner. Every achievement begins with the courage to try.", author: "" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "She believed she could, so she did.", author: "" },
];

const MILESTONE_MESSAGES: Record<number, string> = {
  1: "You sent your first message to Noor!",
  5: "5 conversations with Noor — you're building a habit!",
  10: "10 conversations — you're on a real learning journey!",
  25: "25 chats with Noor — incredible dedication!",
  50: "50 conversations — you're a true learner! 🌟",
  100: "100 conversations — you're unstoppable! 💜",
  250: "250 chats — Noor is so proud of you!",
  500: "500 conversations — legendary learner! 🏆",
};

interface DashboardContentProps {
  greeting: string;
  hasProfile: boolean;
  goals: string | null;
  name: string | null;
  messageCount: number;
  streak: number;
  latestMilestone: number | null;
  lang?: string;
}

export function DashboardContent({ greeting, hasProfile, goals, name, messageCount, streak, latestMilestone, lang = "en" }: DashboardContentProps) {
  const quote = QUOTES[new Date().getDay() % QUOTES.length]!;
  const goalList = goals?.split(", ").slice(0, 2) ?? [];
  const firstName = name?.split(" ")[0] ?? "there";

  const features = [
    { href: "/library", icon: Library, label: t(lang, "quietLibrary"), desc: t(lang, "coursesLessons"), color: "from-emerald-50 to-teal-50", iconColor: "text-emerald-600 bg-emerald-100" },
    { href: "/circles", icon: Users, label: t(lang, "peerCircles"), desc: t(lang, "peerLearning"), color: "from-pink-50 to-rose-50", iconColor: "text-pink-600 bg-pink-100" },
    { href: "/stories", icon: Star, label: t(lang, "stories"), desc: t(lang, "beInspired"), color: "from-amber-50 to-yellow-50", iconColor: "text-amber-600 bg-amber-100" },
    { href: "/news", icon: Megaphone, label: t(lang, "announcements"), desc: t(lang, "announcements"), color: "from-blue-50 to-indigo-50", iconColor: "text-blue-600 bg-blue-100" },
    { href: "/reviews", icon: Heart, label: t(lang, "reviews"), desc: t(lang, "community"), color: "from-violet-50 to-purple-50", iconColor: "text-violet-600 bg-violet-100" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto pb-24 lg:pb-8">

      {/* Milestone confetti */}
      {latestMilestone && MILESTONE_MESSAGES[latestMilestone] && (
        <Confetti
          milestoneCount={latestMilestone}
          message={MILESTONE_MESSAGES[latestMilestone]!}
        />
      )}

      {/* Hero Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple via-brand-purple-light to-[#7C3AED] p-6 sm:p-8 shadow-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-brand-lavender/80 text-sm font-medium mb-1">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 leading-tight">
                {t(lang, "welcomeBack")}, {firstName} 🌸
              </h1>
              {goalList.length > 0 ? (
                <p className="text-white/70 text-sm">
                  {t(lang, "yourFocus")} <span className="text-brand-lavender font-medium">{goalList.join(" · ")}</span>
                </p>
              ) : (
                <p className="text-white/70 text-sm">{t(lang, "readyToLearn")}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {messageCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/60 text-xs">{messageCount} {t(lang, "conversations")}</span>
                  </div>
                )}
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                    <Flame size={12} className="text-orange-300" />
                    <span className="text-white/90 text-xs font-semibold">
                      {streak} {t(lang, "dayStreak")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/mentor"
              className="flex-shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2.5 rounded-2xl transition-all duration-200 group border border-white/20"
            >
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              {t(lang, "askNoorShort")}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Profile Setup Banner */}
      {!hasProfile && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <Link href="/onboarding">
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:shadow-soft transition-all group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">✨</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900">{t(lang, "setupProfile")}</p>
                <p className="text-xs text-amber-700 mt-0.5">{t(lang, "setupProfileDesc")}</p>
              </div>
              <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </Link>
        </motion.div>
      )}

      {/* Bento Grid — two cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* AI Mentor */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <Link href="/mentor">
            <div className="group relative overflow-hidden bg-white rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 p-5 h-full min-h-[148px] flex flex-col justify-between cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lavender-light rounded-full -translate-y-16 translate-x-16 pointer-events-none opacity-50" />
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center text-xl shadow-soft">🌸</div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Noor — {t(lang, "aiMentor")}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-xs text-muted">{t(lang, "alwaysAvailable")}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{t(lang, "noorDesc")}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-brand-purple text-xs font-semibold group-hover:gap-2.5 transition-all">
                {t(lang, "startConversation")} <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Learning Path */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}>
          <Link href="/learning">
            <div className="group relative overflow-hidden bg-white rounded-3xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 p-5 h-full min-h-[148px] flex flex-col justify-between cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16 pointer-events-none opacity-60" />
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{t(lang, "learningPath")}</h3>
                    <p className="text-xs text-muted">{hasProfile ? t(lang, "yourRoadmap") : t(lang, "createRoadmap")}</p>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {hasProfile ? t(lang, "pathDesc") : t(lang, "pathDescNew")}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-blue-600 text-xs font-semibold group-hover:gap-2.5 transition-all">
                {hasProfile ? t(lang, "viewPath") : t(lang, "getStarted")} <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-1">{t(lang, "explore")}</h2>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
              >
                <Link href={f.href}>
                  <div className={cn(
                    "bg-gradient-to-br rounded-2xl p-2.5 sm:p-3 border border-border hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col items-center text-center gap-1.5",
                    f.color
                  )}>
                    <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0", f.iconColor)}>
                      <Icon size={15} />
                    </div>
                    <p className="text-[11px] font-semibold text-foreground leading-none">{f.label.split(" ")[0]}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily quote */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="bg-gradient-to-br from-brand-lavender-light to-white rounded-3xl border border-brand-lavender/30 p-5 h-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💫</span>
              <h3 className="text-sm font-semibold text-foreground">{t(lang, "todaysThought")}</h3>
            </div>
            <blockquote className="text-sm text-muted italic leading-relaxed mb-3">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            {quote.author && (
              <p className="text-xs text-brand-purple/60 font-medium">— {quote.author}</p>
            )}
            <Link href="/stories" className="inline-flex items-center gap-1 text-xs text-brand-purple font-medium mt-3 hover:gap-1.5 transition-all">
              {t(lang, "moreStories")} <ArrowRight size={11} />
            </Link>
          </div>
        </motion.div>

        {/* Quick actions + streak card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="bg-white rounded-3xl border border-border shadow-card p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-brand-purple" />
              <h3 className="text-sm font-semibold text-foreground">{t(lang, "quickActions")}</h3>
            </div>
            <div className="space-y-1.5 flex-1">
              {[
                { href: "/mentor", label: t(lang, "askNoor"), icon: MessageCircle, color: "text-brand-purple" },
                { href: "/library", label: t(lang, "continueCourse"), icon: Library, color: "text-emerald-600" },
                { href: "/circles", label: t(lang, "checkCircles"), icon: Users, color: "text-pink-600" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-lavender-light transition-colors group cursor-pointer">
                      <Icon size={14} className={cn(item.color, "flex-shrink-0")} />
                      <span className="text-xs text-foreground group-hover:text-brand-purple transition-colors font-medium">{item.label}</span>
                      <ArrowRight size={11} className="text-muted ml-auto group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Streak mini-card */}
            {streak >= 2 && (
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Flame size={14} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {streak} {t(lang, "learningStreak")}
                  </p>
                  <p className="text-[10px] text-muted">{t(lang, "comeBackTomorrow")}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
