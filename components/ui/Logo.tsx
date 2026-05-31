"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ size = "md", variant = "dark", className }: LogoProps) {
  const sizes = {
    sm: { flower: 24, text: "text-lg" },
    md: { flower: 32, text: "text-2xl" },
    lg: { flower: 48, text: "text-4xl" },
  };

  const s = sizes[size];
  const isDark = variant === "dark";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FlowerSVG size={s.flower} isDark={isDark} />
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            s.text,
            "font-display italic font-bold tracking-tight",
            isDark ? "text-brand-purple" : "text-white"
          )}
        >
          Her
        </span>
        <span
          className={cn(
            s.text,
            "font-sans font-semibold tracking-widest uppercase",
            isDark ? "text-brand-purple" : "text-brand-lavender"
          )}
          style={{ fontSize: `calc(1em * 0.75)` }}
        >
          ACCESS
        </span>
      </div>
    </div>
  );
}

function FlowerSVG({ size, isDark }: { size: number; isDark: boolean }) {
  const primary = isDark ? "#3B1347" : "#F4D1FF";
  const secondary = isDark ? "#7C3AED" : "#E8B8FF";
  const center = isDark ? "#F4D1FF" : "#3B1347";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Petal 1 - top */}
      <ellipse
        cx="24"
        cy="10"
        rx="6"
        ry="10"
        fill={primary}
        opacity="0.9"
      />
      {/* Petal 2 - top-right */}
      <ellipse
        cx="37"
        cy="17"
        rx="6"
        ry="10"
        fill={secondary}
        opacity="0.85"
        transform="rotate(72 37 17)"
      />
      {/* Petal 3 - bottom-right */}
      <ellipse
        cx="32"
        cy="36"
        rx="6"
        ry="10"
        fill={primary}
        opacity="0.8"
        transform="rotate(144 32 36)"
      />
      {/* Petal 4 - bottom-left */}
      <ellipse
        cx="16"
        cy="36"
        rx="6"
        ry="10"
        fill={secondary}
        opacity="0.85"
        transform="rotate(216 16 36)"
      />
      {/* Petal 5 - top-left */}
      <ellipse
        cx="11"
        cy="17"
        rx="6"
        ry="10"
        fill={primary}
        opacity="0.9"
        transform="rotate(288 11 17)"
      />
      {/* Center */}
      <circle cx="24" cy="24" r="7" fill={center} />
      <circle cx="24" cy="24" r="4" fill={isDark ? "#3B1347" : "#FAF0FF"} opacity="0.6" />
    </svg>
  );
}
