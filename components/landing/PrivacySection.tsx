"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, EyeOff, Wifi } from "lucide-react";

const privacyFeatures = [
  {
    icon: ShieldCheck,
    title: "No identity required",
    description: "Use a nickname. Your real name is never required or stored publicly.",
  },
  {
    icon: EyeOff,
    title: "Instant stealth mode",
    description: "One tap transforms the app into a cooking website. No traces left.",
  },
  {
    icon: Lock,
    title: "Encrypted & secure",
    description: "All data is encrypted. Your learning stays between you and your AI mentor.",
  },
  {
    icon: Wifi,
    title: "Works offline",
    description: "Download lessons when you have connection. Learn anywhere, anytime.",
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand-lavender/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lavender/10 border border-brand-lavender/20 mb-6">
              <Eye size={14} className="text-brand-lavender" />
              <span className="text-xs font-medium text-brand-lavender">
                Your Safety First
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Designed for{" "}
              <span className="italic text-brand-lavender">privacy and safety</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              We understand that for many of our users, privacy isn&apos;t a
              preference — it&apos;s a necessity. Every feature is built with your
              safety as the foundation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {privacyFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-lavender/20 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-brand-lavender" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
