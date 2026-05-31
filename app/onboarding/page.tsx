"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { saveOnboarding } from "@/actions/auth";
import {
  EDUCATION_LEVELS,
  LEARNING_GOALS,
  TIME_OPTIONS,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    educationLevel: "",
    learningGoals: [] as string[],
    timeAvailable: "",
    careerDream: "",
    interests: "",
  });

  const update = (field: keyof typeof data, value: string | string[]) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleGoal = (val: string) => {
    setData((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(val)
        ? prev.learningGoals.filter((g) => g !== val)
        : [...prev.learningGoals, val],
    }));
  };

  const canNext = () => {
    if (step === 1) return !!data.educationLevel;
    if (step === 2) return data.learningGoals.length > 0;
    if (step === 3) return !!data.timeAvailable;
    return true;
  };

  const handleFinish = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const result = await saveOnboarding({
        userId: session.user.id,
        educationLevel: data.educationLevel,
        learningGoals: data.learningGoals.join(", "),
        timeAvailable: data.timeAvailable,
        careerDream: data.careerDream,
        interests: data.interests,
      });

      if (result.success) {
        toast.success("Your profile is ready! Let's start learning 🌟");
        router.push("/dashboard");
      } else {
        toast.error(result.error ?? "Failed to save profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-muted hover:text-brand-purple"
        >
          Skip for now
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-300",
                  i < step ? "bg-brand-purple" : "bg-brand-lavender"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl shadow-card p-8"
            >
              {step === 1 && (
                <StepEducation
                  value={data.educationLevel}
                  onChange={(v) => update("educationLevel", v)}
                />
              )}
              {step === 2 && (
                <StepGoals
                  value={data.learningGoals}
                  onToggle={toggleGoal}
                />
              )}
              {step === 3 && (
                <StepTime
                  value={data.timeAvailable}
                  onChange={(v) => update("timeAvailable", v)}
                />
              )}
              {step === 4 && (
                <StepDreams
                  careerDream={data.careerDream}
                  interests={data.interests}
                  onChangeDream={(v) => update("careerDream", v)}
                  onChangeInterests={(v) => update("interests", v)}
                />
              )}

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                )}
                {step < STEPS ? (
                  <Button
                    fullWidth={step === 1}
                    className="flex-1"
                    disabled={!canNext()}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    loading={loading}
                    onClick={handleFinish}
                  >
                    <Check size={16} />
                    Start Learning!
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StepEducation({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-4xl mb-4">📚</div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        What&apos;s your education level?
      </h2>
      <p className="text-muted text-sm mb-6">
        This helps us tailor your learning experience perfectly.
      </p>
      <div className="space-y-3">
        {EDUCATION_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
              value === level.value
                ? "border-brand-purple bg-brand-lavender-light text-brand-purple"
                : "border-border hover:border-brand-purple/50 text-foreground"
            )}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepGoals({
  value,
  onToggle,
}: {
  value: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-4xl mb-4">🎯</div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        What do you want to learn?
      </h2>
      <p className="text-muted text-sm mb-6">
        Select all that interest you. You can always add more later.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {LEARNING_GOALS.map((goal) => {
          const selected = value.includes(goal.value);
          return (
            <button
              key={goal.value}
              onClick={() => onToggle(goal.value)}
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
  );
}

function StepTime({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-4xl mb-4">⏰</div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        How much time can you study daily?
      </h2>
      <p className="text-muted text-sm mb-6">
        We&apos;ll build your plan around your real schedule.
      </p>
      <div className="space-y-3">
        {TIME_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-200",
              value === option.value
                ? "border-brand-purple bg-brand-lavender-light text-brand-purple"
                : "border-border hover:border-brand-purple/50 text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDreams({
  careerDream,
  interests,
  onChangeDream,
  onChangeInterests,
}: {
  careerDream: string;
  interests: string;
  onChangeDream: (v: string) => void;
  onChangeInterests: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-4xl mb-4">🌟</div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        What are your dreams?
      </h2>
      <p className="text-muted text-sm mb-6">
        Share your hopes with us. Your AI mentor will help you get there.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            What&apos;s your career dream?
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            rows={3}
            placeholder="e.g., Become a software engineer, doctor, teacher, entrepreneur..."
            value={careerDream}
            onChange={(e) => onChangeDream(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            What are your interests or hobbies?
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            rows={3}
            placeholder="e.g., Reading, drawing, science, music, nature..."
            value={interests}
            onChange={(e) => onChangeInterests(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
