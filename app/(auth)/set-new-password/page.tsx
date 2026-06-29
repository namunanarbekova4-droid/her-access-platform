"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { AUTH_UI, AUTH_LANG_FLAGS, type AuthLang } from "@/lib/auth-translations";

function SetNewPasswordForm({ ui }: { ui: typeof AUTH_UI[AuthLang] }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(ui.errInvalidLink);
    }
  }, [token, ui.errInvalidLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage(ui.errPwdLength);
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMessage(ui.errPwdMatch);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/set-new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.error ?? ui.errUnknown);
      }
    } catch {
      setStatus("error");
      setMessage(ui.errNetwork);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="font-semibold text-foreground mb-2">{ui.pwdUpdated}</h2>
        <p className="text-sm text-muted mb-6">{ui.pwdUpdatedMsg}</p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-2xl bg-[#3B1347] text-white font-medium hover:bg-[#4a1a5a] transition-colors text-sm"
        >
          {ui.goToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{ui.newPwd}</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={!token || status === "loading"}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1347]/30 focus:border-[#3B1347] disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{ui.confirmPwd}</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            disabled={!token || status === "loading"}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B1347]/30 focus:border-[#3B1347] disabled:opacity-50"
          />
        </div>
      </div>

      {status === "error" && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-rose-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!token || status === "loading"}
        className="w-full py-3 rounded-2xl bg-[#3B1347] text-white font-semibold text-sm hover:bg-[#4a1a5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? ui.saving : ui.setPwd}
      </button>
    </form>
  );
}

export default function SetNewPasswordPage() {
  const [displayLang, setDisplayLang] = useState<AuthLang>("en");
  const ui = AUTH_UI[displayLang];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-white rounded-3xl shadow-card p-8">
        {/* Language picker */}
        <div className="flex justify-end gap-1 mb-6">
          {AUTH_LANG_FLAGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setDisplayLang(l.code)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${displayLang === l.code ? "bg-brand-purple text-white" : "bg-gray-100 text-gray-500 hover:bg-brand-lavender-light hover:text-brand-purple"}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">{ui.setNewPwdTitle}</h1>
          <p className="text-muted text-sm">{ui.setNewPwdSubtitle}</p>
        </div>

        <Suspense fallback={<div className="text-center py-8 text-muted text-sm">…</div>}>
          <SetNewPasswordForm ui={ui} />
        </Suspense>

        <p className="text-center text-sm text-muted mt-6">
          {ui.rememberPwd}{" "}
          <Link href="/login" className="text-[#3B1347] font-medium hover:underline">{ui.signIn}</Link>
        </p>
      </div>
    </motion.div>
  );
}
