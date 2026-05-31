"use client";

import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Eye, Library, Users, Star } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Mentor Noor",
    description:
      "Your personal AI mentor responds in your native language — Arabic, Dari, Pashto, English, or Russian. She guides, motivates, and teaches.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    icon: BookOpen,
    title: "Adaptive Learning Path",
    description:
      "AI generates a 12-week personalized roadmap based on your goals, level, and available time. Tracks your progress automatically.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: Eye,
    title: "Safe Anonymous Mode",
    description:
      "One-click stealth mode instantly transforms the platform into a cooking website. Your safety is always our first priority.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: Library,
    title: "Quiet Library",
    description:
      "Download lessons and access them offline. Designed for unstable internet connections with lightweight, essential content.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
  {
    icon: Users,
    title: "Peer Circles",
    description:
      "Join small anonymous groups of 3–5 girls with shared interests. Support each other, share progress, and study together safely.",
    color: "bg-pink-50 text-pink-600",
    border: "border-pink-100",
  },
  {
    icon: Star,
    title: "Inspiration Stories",
    description:
      "AI-generated stories of real girls who overcame restrictions to build amazing futures. Motivation when you need it most.",
    color: "bg-brand-lavender text-brand-purple",
    border: "border-brand-lavender-mid",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lavender-light border border-border mb-4">
            <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
              Platform Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Everything you need to{" "}
            <span className="text-brand-purple italic">grow and thrive</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Designed specifically for girls who deserve access to world-class
            education, regardless of where they live.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-3xl border ${feature.border} p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-default`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
