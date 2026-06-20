import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to avoid recreating the Prisma Client on every hot reload
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export const db = prisma;

// Ensure this file exists as a boilerplate for setup, though it's not directly runnable here.
// In a real project, connection handling would be more robust.