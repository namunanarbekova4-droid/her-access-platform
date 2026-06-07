"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Linkedin,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  User,
  Briefcase,
  GraduationCap,
  Target,
  Zap,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

interface LinkedInProfile {
  headline: string;
  about: string;
  experience: { title: string; highlights: string[] }[];
  skills: string[];
  summary_tips: string[];
  connection_message: string;
}

const toneOptions = [
  { value: "professional", label: "Professional", emoji: "💼", desc: "Formal & results-driven" },
  { value: "creative", label: "Creative", emoji: "🎨", desc: "Innovative & story-driven" },
  { value: "warm", label: "Warm", emoji: "🌸", desc: "Approachable & human" },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-brand-purple hover:text-brand-purple-light transition-colors px-2 py-1 rounded-lg hover:bg-brand-lavender-light"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-lavender-light flex items-center justify-center">
            <Icon size={16} className="text-brand-purple" />
          </div>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function LinkedInFormatter() {
  const [form, setForm] = useState({
    name: "",
    currentRole: "",
    yearsExperience: "",
    education: "",
    skills: "",
    achievements: "",
    goals: "",
    tone: "professional" as "professional" | "creative" | "warm",
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.currentRole || !form.skills) {
      toast.error("Please fill in Name, Role, and Skills at minimum.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/linkedin/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: "en" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setProfile(data.profile);
      setTimeout(() => {
        document.getElementById("linkedin-result")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    multiline = false,
    required = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-brand-purple">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
        />
      ) : (
        <input
          type="text"
          value={form[key] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#0A66C2] flex items-center justify-center">
            <Linkedin size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">LinkedIn Profile Builder</h1>
            <p className="text-sm text-muted">AI-powered, professionally crafted just for you</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
      >
        <Card className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Sparkles size={16} className="text-brand-purple" />
            <span className="font-semibold text-foreground">Your Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("name", "Full Name", "e.g. Amina Hassan", false, true)}
            {field("currentRole", "Current / Target Role", "e.g. Software Engineer", false, true)}
            {field("yearsExperience", "Years of Experience", "e.g. 3 years")}
            {field("education", "Education", "e.g. BSc Computer Science, Kabul University")}
          </div>

          {field("skills", "Key Skills", "e.g. Python, project management, communication, data analysis", false, true)}
          {field("achievements", "Notable Achievements", "e.g. Led a team of 5, built app used by 2,000 people, published research paper", true)}
          {field("goals", "Career Goals", "e.g. Transition into tech leadership, help women access education", true)}

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Profile Tone</label>
            <div className="grid grid-cols-3 gap-3">
              {toneOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, tone: t.value })}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    form.tone === t.value
                      ? "border-brand-purple bg-brand-lavender-light"
                      : "border-border hover:border-brand-purple/40"
                  }`}
                >
                  <div className="text-xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-semibold text-foreground">{t.label}</div>
                  <div className="text-xs text-muted">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting your profile...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate LinkedIn Profile
              </>
            )}
          </Button>
        </Card>
      </motion.form>

      {/* Results */}
      <AnimatePresence>
        {profile && (
          <motion.div
            id="linkedin-result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              <h2 className="text-lg font-display font-bold text-foreground">Your LinkedIn Profile is Ready!</h2>
            </div>

            {/* Headline */}
            <Section title="Headline" icon={User}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-foreground font-medium leading-relaxed flex-1">{profile.headline}</p>
                <CopyButton text={profile.headline} />
              </div>
              <p className="text-xs text-muted mt-2">{profile.headline.length} / 220 characters</p>
            </Section>

            {/* About */}
            <Section title="About Section" icon={Briefcase}>
              <div className="flex justify-end mb-2">
                <CopyButton text={profile.about} />
              </div>
              <div className="prose prose-sm max-w-none">
                {profile.about.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="text-foreground text-sm leading-relaxed mb-3">{para}</p>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">{profile.about.length} / 2600 characters</p>
            </Section>

            {/* Experience */}
            {profile.experience?.length > 0 && (
              <Section title="Experience Bullets" icon={Target}>
                <div className="space-y-5">
                  {profile.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground text-sm">{exp.title}</h4>
                        <CopyButton text={exp.highlights.join("\n• ")} />
                      </div>
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="text-brand-purple mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Skills */}
            <Section title="Top Skills" icon={Zap}>
              <div className="flex justify-end mb-3">
                <CopyButton text={profile.skills.join(", ")} />
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-brand-lavender-light text-brand-purple text-sm rounded-full font-medium border border-brand-purple/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            {/* Connection message */}
            <Section title="Connection Request Message" icon={MessageSquare}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-foreground text-sm leading-relaxed flex-1 italic">&ldquo;{profile.connection_message}&rdquo;</p>
                <CopyButton text={profile.connection_message} />
              </div>
              <p className="text-xs text-muted mt-2">{profile.connection_message.length} / 300 characters</p>
            </Section>

            {/* Tips */}
            <Section title="Profile Visibility Tips" icon={Lightbulb} defaultOpen={false}>
              <ul className="space-y-3">
                {profile.summary_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-amber-600">{i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{tip}</p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Regenerate */}
            <div className="flex justify-center pt-2">
              <Button
                variant="secondary"
                onClick={() => setProfile(null)}
                className="flex items-center gap-2"
              >
                <Sparkles size={14} />
                Edit & Regenerate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
