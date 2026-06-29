"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

const LOGIN_UI = {
  en: { welcome: "Welcome back 🌸", subtitle: "Sign in to continue your learning journey.", email: "Email address", password: "Password", signIn: "Sign In", noAccount: "Don't have an account?", createOne: "Create one — it's free", forgot: "Forgot password?" },
  ar: { welcome: "مرحباً بعودتك 🌸", subtitle: "سجلي الدخول لمواصلة رحلة تعلمك.", email: "البريد الإلكتروني", password: "كلمة المرور", signIn: "تسجيل الدخول", noAccount: "ليس لديك حساب؟", createOne: "أنشئي واحداً — مجاناً", forgot: "نسيتِ كلمة المرور؟" },
  fa: { welcome: "خوش آمدی 🌸", subtitle: "برای ادامه سفر یادگیری‌ات وارد شو.", email: "ایمیل", password: "رمز عبور", signIn: "ورود", noAccount: "حساب ندارید؟", createOne: "یک حساب رایگان بساز", forgot: "رمز عبور را فراموش کردی؟" },
  ps: { welcome: "ښه راغلې 🌸", subtitle: "د زده کړې سفر ادامه کولو لپاره داخل شه.", email: "ایمیل", password: "پاسورډ", signIn: "ننوتل", noAccount: "حساب نه لرې؟", createOne: "وړیا حساب جوړ کړه", forgot: "پاسورډ مو هیر شو؟" },
  ru: { welcome: "С возвращением 🌸", subtitle: "Войди, чтобы продолжить учёбу.", email: "Электронная почта", password: "Пароль", signIn: "Войти", noAccount: "Нет аккаунта?", createOne: "Создай бесплатно", forgot: "Забыла пароль?" },
} as const;

const LANG_FLAGS = [
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
  { code: "fa", label: "د" },
  { code: "ps", label: "پ" },
  { code: "ru", label: "Р" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [displayLang, setDisplayLang] = useState<keyof typeof LOGIN_UI>("en");
  const ui = LOGIN_UI[displayLang];

  // Wake up Neon DB as soon as the page loads
  useEffect(() => {
    fetch("/api/health").catch(() => {});
  }, []);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email address";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-3xl shadow-card p-8">
        {/* Language picker */}
        <div className="flex justify-end gap-1 mb-6">
          {LANG_FLAGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setDisplayLang(l.code)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${displayLang === l.code ? "bg-brand-purple text-white" : "bg-gray-100 text-gray-500 hover:bg-brand-lavender-light hover:text-brand-purple"}`}
              title={l.code}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            {ui.welcome}
          </h1>
          <p className="text-muted text-sm">{ui.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={ui.email}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail size={16} />}
            autoComplete="email"
          />

          <div>
            <Input
              label={ui.password}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={16} />}
              autoComplete="current-password"
            />
            <div className="text-right mt-1.5">
              <Link href="/forgot-password" className="text-xs text-muted hover:text-brand-purple transition-colors">
                {ui.forgot}
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
            className="mt-2"
          >
            {ui.signIn}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          {ui.noAccount}{" "}
          <Link
            href="/register"
            className="text-brand-purple font-medium hover:underline"
          >
            {ui.createOne}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
