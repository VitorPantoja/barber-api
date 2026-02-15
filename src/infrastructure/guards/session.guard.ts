import { type CanActivate, type ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { type PrismaClient } from 'src/generated/prisma/client';
import { UserMapper } from 'src/infrastructure/database/mappers/user.mapper';
import { PRISMA_TOKEN } from 'src/infrastructure/modules/database/database.module';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'] as string | undefined;
    const cookieToken = request.cookies?.['better-auth.session_token'] as string | undefined;
    const token = this.extractBearerToken(authHeader) ?? cookieToken;

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const session = await this.prisma.session.findUnique({
      include: { user: true },
      where: { token }
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session token');
    }

    if (new Date() > session.expiresAt) {
      throw new UnauthorizedException('Session expired');
    }

    request.user = UserMapper.toDomain(session.user);
    return true;
  }

  private extractBearerToken(header?: string): string | null {
    if (!header?.startsWith('Bearer ')) return null;

    return header.slice(7);
  }
}
