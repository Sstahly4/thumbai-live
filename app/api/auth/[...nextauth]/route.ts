// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Reverted to path alias

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// We will create the actual auth configuration file next. 