import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#3B1347",
          "purple-light": "#5C2270",
          "purple-dark": "#2A0D33",
          lavender: "#F4D1FF",
          "lavender-light": "#FAF0FF",
          "lavender-mid": "#E8B8FF",
          gray: "#DBDBDB",
          "gray-light": "#F5F5F5",
          "gray-dark": "#9CA3AF",
        },
        background: "#FDFAFF",
        foreground: "#1A0A22",
        muted: "#6B7280",
        border: "#E9D8F5",
        card: "#FFFFFF",
        "card-hover": "#FAF0FF",
        accent: "#7C3AED",
        "accent-light": "#DDD6FE",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Arabic", "Noto Sans", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(59, 19, 71, 0.08)",
        card: "0 4px 24px rgba(59, 19, 71, 0.06)",
        "card-hover": "0 8px 40px rgba(59, 19, 71, 0.12)",
        glow: "0 0 30px rgba(124, 58, 237, 0.15)",
        "glow-strong": "0 0 50px rgba(124, 58, 237, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand":
          "linear-gradient(135deg, #3B1347 0%, #5C2270 50%, #7C3AED 100%)",
        "gradient-soft":
          "linear-gradient(135deg, #FAF0FF 0%, #F4D1FF 50%, #E8B8FF 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #2A0D33 0%, #3B1347 40%, #5C2270 100%)",
        shimmer:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
    },
  },
  plugins: [],
};
export default config;
