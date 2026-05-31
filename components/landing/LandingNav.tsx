"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-purple-dark/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="sm" variant="light" />

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Privacy"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:text-brand-purple hover:bg-white">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="sm">
                Start Learning
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-purple-dark border-t border-white/10 px-4 py-4 space-y-3">
          {["Features", "How It Works", "Privacy"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block text-sm text-white/70 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="sm" fullWidth className="border-white/30 text-white hover:bg-white hover:text-brand-purple">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button variant="secondary" size="sm" fullWidth>
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
