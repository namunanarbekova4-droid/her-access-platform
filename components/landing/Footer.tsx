import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-brand-purple-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Logo size="md" variant="light" className="mb-2" />
            <p className="text-white/50 text-sm">
              AI education for every girl, everywhere.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Contact</span>
            <span>About</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            © 2024 Her Access. Built with love for girls everywhere who deserve to learn.
          </p>
        </div>
      </div>
    </footer>
  );
}
