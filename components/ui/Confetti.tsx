"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLES = [
  { id: 0, x: 8, delay: 0, color: "#8B5CF6", shape: "circle" },
  { id: 1, x: 18, delay: 0.1, color: "#EC4899", shape: "square" },
  { id: 2, x: 28, delay: 0.05, color: "#F59E0B", shape: "circle" },
  { id: 3, x: 38, delay: 0.15, color: "#10B981", shape: "square" },
  { id: 4, x: 48, delay: 0.02, color: "#3B82F6", shape: "circle" },
  { id: 5, x: 58, delay: 0.12, color: "#8B5CF6", shape: "square" },
  { id: 6, x: 68, delay: 0.08, color: "#EC4899", shape: "circle" },
  { id: 7, x: 78, delay: 0.18, color: "#F59E0B", shape: "square" },
  { id: 8, x: 88, delay: 0.04, color: "#10B981", shape: "circle" },
  { id: 9, x: 93, delay: 0.14, color: "#3B82F6", shape: "square" },
  { id: 10, x: 13, delay: 0.22, color: "#EC4899", shape: "circle" },
  { id: 11, x: 33, delay: 0.06, color: "#8B5CF6", shape: "square" },
  { id: 12, x: 53, delay: 0.16, color: "#F59E0B", shape: "circle" },
  { id: 13, x: 73, delay: 0.03, color: "#10B981", shape: "square" },
  { id: 14, x: 43, delay: 0.2, color: "#3B82F6", shape: "circle" },
  { id: 15, x: 63, delay: 0.09, color: "#EC4899", shape: "square" },
  { id: 16, x: 23, delay: 0.17, color: "#8B5CF6", shape: "circle" },
  { id: 17, x: 83, delay: 0.11, color: "#F59E0B", shape: "square" },
  { id: 18, x: 3, delay: 0.19, color: "#10B981", shape: "circle" },
  { id: 19, x: 97, delay: 0.07, color: "#3B82F6", shape: "square" },
];

interface ConfettiProps {
  milestoneCount: number;
  message: string;
}

export function Confetti({ milestoneCount, message }: ConfettiProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = `celebrated_${milestoneCount}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
      localStorage.setItem(key, "1");
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [milestoneCount]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
        >
          {/* Particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
              animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.id % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 2.5, delay: p.delay, ease: "easeIn" }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: 0,
                width: 10,
                height: 10,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : "2px",
              }}
            />
          ))}

          {/* Celebration banner */}
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-border px-6 py-4 text-center min-w-[260px]">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-bold text-foreground text-sm">{message}</p>
              <p className="text-xs text-muted mt-0.5">Keep it up — you&apos;re doing amazing!</p>
              <button
                onClick={() => setVisible(false)}
                className="mt-2 text-xs text-brand-purple font-medium hover:underline"
              >
                Thanks, Noor! ✨
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
