import { Pool } from 'pg';

import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../../../generated/prisma/client';

export const PRISMA_TOKEN = 'PrismaClient';

@Global()
@Module({
  exports: [PRISMA_TOKEN],
  providers: [
    {
      provide: PRISMA_TOKEN,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        return prisma;
      }
    }
  ]
})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy() {
    // Cleanup handled by pool closure
  }
}
