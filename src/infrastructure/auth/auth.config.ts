import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { type PrismaClient } from 'src/generated/prisma/client';

export function createAuthInstance(prisma: PrismaClient) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    database: prismaAdapter(prisma, {
      provider: 'postgresql'
    }),
    emailAndPassword: {
      enabled: true
    },
    trustedOrigins: (process.env.TRUSTED_ORIGINS ?? 'http://localhost:3000').split(',')
  });
}

export type AuthInstance = ReturnType<typeof createAuthInstance>;
