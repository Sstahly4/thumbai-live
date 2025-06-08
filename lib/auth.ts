// lib/auth.ts
import type { NextAuthOptions, User as NextAuthUser, Session as NextAuthSession } from "next-auth"; // Renamed Session to NextAuthSession
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials"; // Removed for diagnostics
import { prisma } from "./prisma"; // Import the prisma client instance
import { UAParser } from 'ua-parser-js'; // Restored import
// import { headers } from 'next/headers'; // Commented out for now
import bcrypt from "bcryptjs"; // No longer needed if CredentialsProvider is removed
// import { headers } from 'next/headers'; // To attempt to get headers - Commented out for diagnostics

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
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
      console.log("NextAuth signIn event user:", message.user);
      if (!message.user || !message.user.id) {
        console.error("SignIn event: User or User ID is missing.");
        return;
      }

      // Attempt to get headers - THIS IS UNRELIABLE IN signIn EVENT - Commented out
      let ipAddress: string | null = null; // Set to null
      let userAgentString: string | null = null; // Set to null
      // try {
      //   const headerMap = headers(); // This line causes issues
      //   ipAddress = headerMap.get('x-forwarded-for') || headerMap.get('remote-addr');
      //   userAgentString = headerMap.get('user-agent');
      // } catch (e) {
      //   console.warn("Could not get headers in signIn event:", e);
      // }
      
      console.log(`SignIn Details - User ID: ${message.user.id}, IP: ${ipAddress || 'unavailable_in_event'}, UA: ${userAgentString || 'unavailable_in_event'}`);

      let deviceType, deviceName, osName, osVersion, browserName, browserVersion;

      if (userAgentString) {
        try {
          const uaResult = UAParser(userAgentString);
          deviceType = uaResult.device.type || null;
          deviceName = uaResult.device.model || null;
          osName = uaResult.os.name || null;
          osVersion = uaResult.os.version || null;
          browserName = uaResult.browser.name || null;
          browserVersion = uaResult.browser.version || null;
        } catch (parseError) {
          console.error("Error parsing User-Agent:", parseError);
        }
      }

      try {
        await prisma.$transaction([
          prisma.loginHistory.create({ // Correct model name
            data: {
              userId: message.user.id,
              ipAddress: ipAddress, 
              userAgent: userAgentString,
              deviceType,
              deviceName,
              osName,
              osVersion,
              browserName,
              browserVersion,
              // timestamp is @default(now()) in schema
            },
          }),
          prisma.user.update({
            where: { id: message.user.id },
            data: { lastLogin: new Date() },
          }),
        ]);
        console.log("Login history and user lastLogin updated successfully.");
      } catch (dbError) {
        console.error("Error saving login history or updating user:", dbError);
      }

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