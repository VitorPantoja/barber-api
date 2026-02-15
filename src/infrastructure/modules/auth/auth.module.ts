import { Module } from '@nestjs/common';

import { type PrismaClient } from '../../../generated/prisma/client';
import { AuthProxyService } from '../../auth/auth-proxy.service';
import { createAuthInstance } from '../../auth/auth.config';
import { AuthController } from '../../auth/auth.controller';
import { PRISMA_TOKEN } from '../database/database.module';

export const AUTH_INSTANCE_TOKEN = 'AUTH_INSTANCE';

@Module({
  controllers: [AuthController],
  exports: [AUTH_INSTANCE_TOKEN],
  providers: [
    {
      inject: [PRISMA_TOKEN],
      provide: AUTH_INSTANCE_TOKEN,
      useFactory: (prisma: PrismaClient) => createAuthInstance(prisma)
    },
    {
      inject: [AUTH_INSTANCE_TOKEN],
      provide: AuthProxyService,
      useFactory: (auth: ReturnType<typeof createAuthInstance>) => new AuthProxyService(auth)
    }
  ]
})
export class AuthModule {}
