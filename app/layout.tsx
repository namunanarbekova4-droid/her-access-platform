export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ToastProvider } from "@/components/ui/Toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRtl } from "@/lib/translations";

export const metadata: Metadata = {
  title: {
    default: "Her Access — AI Education for Every Girl",
    template: "%s | Her Access",
  },
  description:
    "An AI-powered educational platform for girls in restricted regions. Learn, grow, and connect — safely and privately.",
  keywords: ["education", "girls", "AI mentor", "learning", "empowerment"],
  authors: [{ name: "Her Access" }],
  robots: "index,follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3B1347",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions).catch(() => null);
  const lang = session?.user?.language ?? "en";
  const dir = isRtl(lang) ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
