// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` in TS
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prevent creating many PrismaClient instances in dev (Next.js hot reload)
export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ["query", "error", "warn"], // uncomment if you want debug logs
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
