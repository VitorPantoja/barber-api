import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUserRepository } from '../../core/domain/repositories';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'] as string | undefined;
    const cookieToken = request.cookies?.['better-auth.session_token'] as string | undefined;
    const token = this.extractBearerToken(authHeader) ?? cookieToken;

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const isDev = process.env.NODE_ENV === 'development';
    const devToken = process.env.DEV_TOKEN ?? 'dev-token-secret-123';

    if (isDev && token === devToken) {
      request.user = {
        barbershopId: null,
        belongsTo: () => true,
        createdAt: new Date(),
        email: 'dev@barber.com',
        emailVerified: true,
        id: 'dev-user-id',
        image: null,
        isAdmin: () => true,
        isBarber: () => false,
        isCompanyAdmin: () => false,
        isCustomer: () => false,
        isTenantMember: () => false,
        name: 'Dev User',
        role: 'ADMIN',
        updatedAt: new Date()
      };
      return true;
    }

    const sessionUser = await this.userRepo.findBySessionToken(token);
    if (sessionUser) {
      request.user = sessionUser;
      return true;
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'jwt-secret-dev'
      });
    } catch {
      throw new UnauthorizedException('Invalid session token or JWT');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    return true;
  }

  private extractBearerToken(header?: string): string | null {
    if (!header?.startsWith('Bearer ')) return null;

    return header.slice(7);
  }
}
