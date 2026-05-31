"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { registerUser } from "@/actions/auth";
import { LANGUAGES } from "@/lib/utils";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: "en",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Your name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords don't match";
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
      const result = await registerUser({
        name: form.name,
        nickname: form.nickname || undefined,
        email: form.email,
        password: form.password,
        language: form.language,
      });

      if (!result.success) {
        toast.error(result.error ?? "Registration failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success("Account created! Let's set up your profile.");
        router.push("/onboarding");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login");
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
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Join Her Access ✨
          </h1>
          <p className="text-muted text-sm">
            Create your private learning account. No real name required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name *"
              placeholder="Your name"
              value={form.name}
              onChange={update("name")}
              error={errors.name}
              icon={<User size={16} />}
              autoComplete="given-name"
            />
            <Input
              label="Nickname (optional)"
              placeholder="BraveRose"
              value={form.nickname}
              onChange={update("nickname")}
            />
          </div>

          <Input
            label="Email address *"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
            icon={<Mail size={16} />}
            autoComplete="email"
          />

          <Select
            label="Preferred language *"
            value={form.language}
            onChange={update("language")}
            options={LANGUAGES.map((l) => ({
              value: l.code,
              label: `${l.nativeName} (${l.name})`,
            }))}
          />

          <Input
            label="Password *"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            icon={<Lock size={16} />}
            hint="Min. 8 characters"
            autoComplete="new-password"
          />

          <Input
            label="Confirm password *"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
            icon={<Lock size={16} />}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
            className="mt-2"
          >
            Create My Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-purple font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
