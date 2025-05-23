// lib/auth.ts
import type { NextAuthOptions, User as NextAuthUser, Session as NextAuthSession } from "next-auth"; // Renamed Session to NextAuthSession
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
// import CredentialsProvider from "next-auth/providers/credentials"; // Removed for diagnostics
import { prisma } from "./prisma"; // Import the prisma client instance
// import bcrypt from "bcryptjs"; // No longer needed if CredentialsProvider is removed

// Minimal User type for session
interface AppUser extends NextAuthUser {
  id: string;
}

// Minimal Session type for session
interface AppSession extends NextAuthSession {
  user: AppUser;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // CredentialsProvider removed for diagnostics
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Temporarily simplify callbacks for diagnostics
  callbacks: {
    // Session callback removed for diagnostics. 
    // The adapter should handle session creation/retrieval; 
    // this callback primarily augments the session object.
    async session({ session, user }) {
      const s = session as AppSession;
      if (s.user && user) {
        s.user.id = user.id;
      }
      return s;
    },
  },
  events: {
    async signIn(message) {
      console.log("NextAuth signIn event:", message);
      if (message.isNewUser) {
        console.log("New user signed in:", message.user);
      } else {
        console.log("Existing user signed in:", message.user);
      }
    },
    async createUser(message) {
       console.log("NextAuth createUser event:", message.user);
    },
    async updateUser(message) {
        console.log("NextAuth updateUser event:", message.user);
    },
    async session(message) { // This event fires when a session is active
        console.log("NextAuth session event:", message.session);
    }
  },
  pages: {
    signIn: "/signup", // Changed from /login to /signup as per current flow
    verifyRequest: '/auth/verify-request',
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}; 