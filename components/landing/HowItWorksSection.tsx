"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up privately. Tell us your language, learning goals, and available time. No real name required.",
    emoji: "✨",
  },
  {
    step: "02",
    title: "Meet Your AI Mentor",
    description:
      "Noor, your personal AI guide, creates a custom learning roadmap and speaks to you in your language.",
    emoji: "🌸",
  },
  {
    step: "03",
    title: "Learn & Grow Safely",
    description:
      "Study at your pace, join peer circles, access offline lessons, and find your story among thousands.",
    emoji: "🚀",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-brand-lavender-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Start in{" "}
            <span className="text-brand-purple italic">three simple steps</span>
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Getting started is easy. Your learning journey begins the moment you sign up.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-card text-center">
                <div className="text-5xl mb-4">{step.emoji}</div>
                <div className="text-xs font-bold text-brand-purple bg-brand-lavender px-3 py-1 rounded-full inline-block mb-4 tracking-widest">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
