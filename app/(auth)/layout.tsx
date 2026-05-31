import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <header className="p-6">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-6 text-center text-xs text-muted">
        Your privacy is our priority. No data is shared.
      </footer>
    </div>
  );
}
