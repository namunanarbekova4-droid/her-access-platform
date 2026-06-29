"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { saveOnboarding } from "@/actions/auth";
import { LANGUAGES, EDUCATION_LEVELS, LEARNING_GOALS, TIME_OPTIONS } from "@/lib/utils";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { Settings, User, BookOpen, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface SettingsContentProps {
  lang: string;
  currentLanguage: string;
  nickname: string | null;
  profile: {
    educationLevel?: string | null;
    learningGoals?: string | null;
    timeAvailable?: string | null;
    careerDream?: string | null;
    interests?: string | null;
  } | null;
}

export function SettingsContent({ lang, currentLanguage, nickname, profile }: SettingsContentProps) {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Account state
  const [language, setLanguage] = useState(currentLanguage);
  const [displayName, setDisplayName] = useState(nickname ?? "");
  const [accountSaving, setAccountSaving] = useState(false);

  // Learning profile state
  const [educationLevel, setEducationLevel] = useState(profile?.educationLevel ?? "");
  const [learningGoals, setLearningGoals] = useState<string[]>(
    profile?.learningGoals ? profile.learningGoals.split(", ").filter(Boolean) : []
  );
  const [timeAvailable, setTimeAvailable] = useState(profile?.timeAvailable ?? "");
  const [careerDream, setCareerDream] = useState(profile?.careerDream ?? "");
  const [interests, setInterests] = useState(profile?.interests ?? "");
  const [profileSaving, setProfileSaving] = useState(false);

  const toggleGoal = (val: string) => {
    setLearningGoals((prev) =>
      prev.includes(val) ? prev.filter((g) => g !== val) : [...prev, val]
    );
  };

  const handleAccountSave = async () => {
    if (!session?.user?.id) return;
    setAccountSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, nickname: displayName.trim() || null }),
      });

      if (res.ok) {
        await update({ language });
        toast.success(t(lang, "changesSaved"));
        router.refresh();
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAccountSaving(false);
    }
  };

  const handleProfileSave = async () => {
    if (!session?.user?.id) return;
    if (!educationLevel || learningGoals.length === 0 || !timeAvailable) {
      toast.error("Please select an education level, at least one goal, and daily study time.");
      return;
    }
    setProfileSaving(true);
    try {
      const result = await saveOnboarding({
        userId: session.user.id,
        educationLevel,
        learningGoals: learningGoals.join(", "),
        timeAvailable,
        careerDream,
        interests,
      });

      if (result.success) {
        await fetch("/api/learning-path", { method: "DELETE" }).catch(() => {});
        toast.success("Profile saved! Your learning path will be regenerated.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to save profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={22} className="text-brand-purple" />
          <h1 className="text-2xl font-display font-bold text-foreground">{t(lang, "settings")}</h1>
        </div>
        <p className="text-muted text-sm">{t(lang, "editProfile")}</p>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-border shadow-card p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-brand-lavender-light flex items-center justify-center">
            <User size={15} className="text-brand-purple" />
          </div>
          <h2 className="font-semibold text-foreground">{t(lang, "accountSection")}</h2>
        </div>

        <div className="space-y-4">
          <Select
            label={t(lang, "language")}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={LANGUAGES.map((l) => ({
              value: l.code,
              label: `${l.nativeName} (${l.name})`,
            }))}
          />

          <Input
            label={t(lang, "displayName")}
            placeholder="e.g. BraveRose"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <Button loading={accountSaving} onClick={handleAccountSave}>
            <Check size={15} />
            {t(lang, "saveChanges")}
          </Button>
        </div>
      </motion.div>

      {/* Learning Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-border shadow-card p-6"
      >
        <div className="flex items-start gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <BookOpen size={15} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{t(lang, "learningPrefSection")}</h2>
            <p className="text-xs text-muted mt-0.5">Saving will regenerate your personalised learning path</p>
          </div>
        </div>

        {/* Education Level */}
        <div className="mb-5">
          <p className="text-sm font-medium text-foreground mb-2.5">📚 Education Level</p>
          <div className="space-y-2">
            {EDUCATION_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => setEducationLevel(level.value)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
                  educationLevel === level.value
                    ? "border-brand-purple bg-brand-lavender-light text-brand-purple"
                    : "border-border hover:border-brand-purple/50 text-foreground"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="mb-5">
          <p className="text-sm font-medium text-foreground mb-2.5">🎯 Learning Goals</p>
          <div className="grid grid-cols-2 gap-2">
            {LEARNING_GOALS.map((goal) => {
              const selected = learningGoals.includes(goal.value);
              return (
                <button
                  key={goal.value}
                  onClick={() => toggleGoal(goal.value)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200 text-left",
                    selected
                      ? "border-brand-purple bg-brand-lavender-light text-brand-purple"
                      : "border-border hover:border-brand-purple/50 text-foreground"
                  )}
                >
                  <span className="text-lg">{goal.emoji}</span>
                  <span>{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Available */}
        <div className="mb-5">
          <p className="text-sm font-medium text-foreground mb-2.5">⏰ Daily Study Time</p>
          <div className="space-y-2">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeAvailable(option.value)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
                  timeAvailable === option.value
                    ? "border-brand-purple bg-brand-lavender-light text-brand-purple"
                    : "border-border hover:border-brand-purple/50 text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Career Dream */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">🌟 Career Dream</label>
          <textarea
            className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            rows={3}
            placeholder="e.g., Become a software engineer, doctor, teacher, entrepreneur..."
            value={careerDream}
            onChange={(e) => setCareerDream(e.target.value)}
          />
        </div>

        {/* Interests */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">💡 Interests & Hobbies</label>
          <textarea
            className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            rows={3}
            placeholder="e.g., Reading, drawing, science, music, nature..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <Button loading={profileSaving} onClick={handleProfileSave}>
          <RefreshCw size={15} />
          Save & Regenerate Learning Path
        </Button>
      </motion.div>
    </div>
  );
}
