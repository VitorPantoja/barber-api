import { Pool } from 'pg';

import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { IUserRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { UserRepository } from '../../database/repositories/user.repository';
import { PRISMA_TOKEN } from './database.constants';

export { PRISMA_TOKEN };
@Global()
@Module({
  exports: [PRISMA_TOKEN, IUserRepository],
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
    },
    {
      provide: IUserRepository,
      useClass: UserRepository
    }
  ]
})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy() {
    // Cleanup handled by pool closure
  }
}
