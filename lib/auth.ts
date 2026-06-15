// Sanitize NEXTAUTH_URL before NextAuth reads it — prevents invalid URL crash during build
if (process.env.NEXTAUTH_URL) {
  try {
    new URL(process.env.NEXTAUTH_URL);
  } catch {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) return null;

        try {
          const sql = neon(dbUrl);
          const rows = await sql`
            SELECT id, email, name, password, language
            FROM "User"
            WHERE email = ${credentials.email.toLowerCase()}
            LIMIT 1
          `;
          const user = rows[0];
          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password as string);
          if (!isValid) return null;

          return {
            id: user.id as string,
            email: user.email as string,
            name: user.name as string,
            language: (user.language as string) ?? "en",
            onboardingDone: false,
            isAdmin: false,
          };
        } catch (err) {
          console.error("[authorize] error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.language = (user as { language?: string }).language ?? "en";
        token.onboardingDone =
          (user as { onboardingDone?: boolean }).onboardingDone ?? false;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.language = token.language as string;
        session.user.onboardingDone = token.onboardingDone as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
