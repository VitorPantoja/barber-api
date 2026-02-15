import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaClient } from 'src/generated/prisma/client';

import { createAuthInstance } from '../../auth/auth.config';
import { AuthController } from '../../auth/auth.controller';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { AuthService } from '../../auth/services/auth.service';
import { PRISMA_TOKEN } from '../database/database.constants';

export const AUTH_INSTANCE_TOKEN = 'AUTH_INSTANCE';

@Module({
  controllers: [AuthController],
  exports: [AUTH_INSTANCE_TOKEN, AuthService, JwtModule],
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'jwt-secret-dev',
      signOptions: { expiresIn: '7d' }
    })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      inject: [PRISMA_TOKEN],
      provide: AUTH_INSTANCE_TOKEN,
      useFactory: (prisma: PrismaClient) => createAuthInstance(prisma)
    }
  ]
})
export class AuthModule {}
