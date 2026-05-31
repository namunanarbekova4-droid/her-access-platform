"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Globe, Lock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-purple-light/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-lavender/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lavender/10 border border-brand-lavender/20 mb-6"
            >
              <ShieldCheck size={14} className="text-brand-lavender" />
              <span className="text-xs font-medium text-brand-lavender">
                Safe · Private · Empowering
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Education is{" "}
              <span className="italic text-brand-lavender">every girl&apos;s</span>{" "}
              right.
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              Her Access brings AI-powered education to girls in restricted
              regions. Learn in your language, at your pace, in complete
              safety — no matter where you are.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Learning Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:text-brand-purple border border-white/20 hover:bg-white"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Globe, label: "5 Languages" },
                { icon: ShieldCheck, label: "Anonymous Mode" },
                { icon: Lock, label: "Private & Secure" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-lavender/10 border border-brand-lavender/20 flex items-center justify-center">
                    <Icon size={14} className="text-brand-lavender" />
                  </div>
                  <span className="text-sm text-white/60">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <IllustrationCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function IllustrationCard() {
  return (
    <div className="relative">
      {/* Main card */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-4">
        {/* Chat preview */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-lavender flex items-center justify-center text-brand-purple font-bold text-sm flex-shrink-0">
            N
          </div>
          <div className="bg-white/15 rounded-2xl rounded-tl-none p-3 flex-1">
            <p className="text-white text-sm">
              Assalamu alaikum! I&apos;m Noor, your personal AI mentor. What would
              you like to learn today? 🌸
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            S
          </div>
          <div className="bg-brand-purple/40 rounded-2xl rounded-tr-none p-3 flex-1">
            <p className="text-white text-sm">I want to learn English and coding!</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-lavender flex items-center justify-center text-brand-purple font-bold text-sm flex-shrink-0">
            N
          </div>
          <div className="bg-white/15 rounded-2xl rounded-tl-none p-3 flex-1">
            <p className="text-white text-sm">
              That&apos;s wonderful! I&apos;ve created a personalized 12-week roadmap for
              you. Let&apos;s begin with basics... ✨
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-xs font-medium">
              Week 3 of 12
            </span>
            <span className="text-brand-lavender text-xs">25%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-brand-lavender rounded-full" />
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card px-3 py-2 text-xs font-medium text-brand-purple"
      >
        🌟 5 languages
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 -left-4 bg-brand-lavender rounded-2xl shadow-card px-3 py-2 text-xs font-medium text-brand-purple"
      >
        🔒 100% Private
      </motion.div>
    </div>
  );
}
