"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  MessageCircle,
  BookOpen,
  Library,
  Users,
  Star,
  LogOut,
  Eye,
  Megaphone,
  Heart,
  ChevronUp,
  Settings,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { StealthMode, type StealthTheme } from "@/components/stealth/StealthMode";
import { t } from "@/lib/translations";

const THEMES: { id: StealthTheme; label: string; emoji: string; desc: string }[] = [
  { id: "recipe", emoji: "👩‍🍳", label: "Recipe Site", desc: "RecipeNook cooking blog" },
  { id: "weather", emoji: "🌤", label: "Weather App", desc: "WeatherNow forecast" },
  { id: "news", emoji: "📰", label: "News Reader", desc: "DailyBrief articles" },
  { id: "calculator", emoji: "🔢", label: "Calculator", desc: "Simple calculator" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const lang = session?.user?.language ?? "en";
  const [stealthTheme, setStealthTheme] = useState<StealthTheme | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/dashboard", label: t(lang, "dashboard"), icon: LayoutDashboard },
    { href: "/mentor", label: t(lang, "aiMentor"), icon: MessageCircle },
    { href: "/learning", label: t(lang, "learningPath"), icon: BookOpen },
    { href: "/library", label: t(lang, "quietLibrary"), icon: Library },
    { href: "/circles", label: t(lang, "peerCircles"), icon: Users },
    { href: "/stories", label: t(lang, "stories"), icon: Star },
    { href: "/news", label: t(lang, "announcements"), icon: Megaphone },
    { href: "/reviews", label: t(lang, "reviews"), icon: Heart },
    { href: "/settings", label: t(lang, "settings"), icon: Settings },
  ];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (stealthTheme) {
    return <StealthMode theme={stealthTheme} onExit={() => setStealthTheme(null)} />;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-border fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-border">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-brand-purple text-white shadow-soft"
                    : "text-muted hover:bg-brand-lavender-light hover:text-brand-purple"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {/* Safe Mode with theme picker */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 w-full transition-all duration-200"
            >
              <Eye size={18} />
              {t(lang, "safeMode")}
              <ChevronUp size={14} className={cn("ml-auto transition-transform duration-200", pickerOpen ? "rotate-180" : "")} />
            </button>

            {pickerOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 pt-3 pb-1.5">{t(lang, "chooseDisguise")}</p>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setStealthTheme(t.id); setPickerOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 w-full hover:bg-brand-lavender-light transition-colors text-left"
                  >
                    <span className="text-xl w-7 text-center">{t.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.label}</p>
                      <p className="text-[10px] text-muted">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted hover:text-error hover:bg-red-50 w-full transition-all duration-200"
          >
            <LogOut size={18} />
            {t(lang, "signOut")}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-[52px]",
                  active
                    ? "text-brand-purple"
                    : "text-muted hover:text-brand-purple"
                )}
              >
                <Icon size={20} className={cn("transition-all", active && "text-brand-purple")} />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          {/* Mobile Safe Mode — cycles through themes on tap */}
          <MobileSafeButton lang={lang} onActivate={(theme) => setStealthTheme(theme)} />
        </div>
      </nav>
    </>
  );
}

function MobileSafeButton({ lang, onActivate }: { lang: string; onActivate: (theme: StealthTheme) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl border border-border shadow-lg overflow-hidden w-44">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 pt-3 pb-1">{t(lang, "disguiseAs")}</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { onActivate(t.id); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 w-full hover:bg-brand-lavender-light text-left"
            >
              <span className="text-base">{t.emoji}</span>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-amber-600 min-w-[52px]"
      >
        <Eye size={20} />
        <span>{t(lang, "safeMode").split(" ")[0]}</span>
      </button>
    </div>
  );
}
