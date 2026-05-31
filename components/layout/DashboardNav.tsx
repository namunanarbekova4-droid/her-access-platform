"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
} from "lucide-react";
import { useState } from "react";
import { StealthMode } from "@/components/stealth/StealthMode";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mentor", label: "AI Mentor", icon: MessageCircle },
  { href: "/learning", label: "Learning Path", icon: BookOpen },
  { href: "/library", label: "Quiet Library", icon: Library },
  { href: "/circles", label: "Peer Circles", icon: Users },
  { href: "/stories", label: "Stories", icon: Star },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [stealthActive, setStealthActive] = useState(false);

  if (stealthActive) {
    return <StealthMode onExit={() => setStealthActive(false)} />;
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
          <button
            onClick={() => setStealthActive(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 w-full transition-all duration-200"
          >
            <Eye size={18} />
            Safe Mode
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted hover:text-error hover:bg-red-50 w-full transition-all duration-200"
          >
            <LogOut size={18} />
            Sign Out
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
                <Icon
                  size={20}
                  className={cn(
                    "transition-all",
                    active && "text-brand-purple"
                  )}
                />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setStealthActive(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-amber-600 min-w-[52px]"
          >
            <Eye size={20} />
            <span>Safe</span>
          </button>
        </div>
      </nav>
    </>
  );
}
