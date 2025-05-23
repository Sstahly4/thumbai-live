import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

console.log(`[Prisma Client Init] DATABASE_URL: ${process.env.DATABASE_URL}`);

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enabled detailed Prisma logging
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma; 