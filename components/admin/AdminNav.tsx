"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Video,
  Library,
  Users,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/videos", label: "Video Lessons", icon: Video },
  { href: "/admin/library", label: "Library Items", icon: Library },
  { href: "/admin/reviews", label: "Review Moderation", icon: Users },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-brand-purple fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Logo size="sm" variant="light" />
          <span className="text-xs text-white/50 mt-1 block font-medium uppercase tracking-widest">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <ArrowLeft size={18} />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-purple px-4 py-3 flex items-center gap-3">
        <Logo size="sm" variant="light" />
        <span className="text-xs text-white/60 font-medium uppercase tracking-widest">
          Admin
        </span>
        <div className="ml-auto flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  active ? "bg-white/20 text-white" : "text-white/50 hover:text-white"
                )}
              >
                <Icon size={18} />
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-white/50 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}
