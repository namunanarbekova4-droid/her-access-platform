import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      language: string;
      onboardingDone: boolean;
    };
  }

  interface User {
    id: string;
    language: string;
    onboardingDone: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    language: string;
    onboardingDone: boolean;
  }
}
