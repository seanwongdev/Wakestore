import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { ReactNode } from "react";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number | undefined;
      username: string | undefined;
      role: string | undefined;
    } & DefaultSession["user"];
  }

  interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    img_url?: string;
  }

  interface LayoutProps {
    children: ReactNode;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
  }
}
