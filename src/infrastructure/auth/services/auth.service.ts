import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../../core/domain/entities';
import { USER_ROLE } from '../../../core/domain/enums';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { type AuthResponse, type JwtPayload } from '../auth.interface';
import { type SignInDto } from '../dtos/sign-in.dto';
import { type SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: IUserRepository
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new User({
      barbershopId: null,
      createdAt: new Date(),
      email: dto.email,
      emailVerified: false,
      id: uuid(),
      image: dto.image ?? null,
      name: dto.name,
      role: USER_ROLE.CUSTOMER,
      updatedAt: new Date()
    });

    const user = await this.userRepo.createWithPassword(newUser, hashedPassword);

    return this.generateToken(user);
  }

  async createGuest(dto: { name: string; email: string; image?: string }): Promise<AuthResponse> {
    const existing = await this.userRepo.findByEmail(dto.email);

    if (existing) {
      throw new BadRequestException('User with this email already exists. Please login.');
    }

    const newUser = new User({
      barbershopId: null,
      createdAt: new Date(),
      email: dto.email,
      emailVerified: false,
      id: uuid(),
      image: dto.image ?? null,
      name: dto.name,
      role: USER_ROLE.CUSTOMER,
      updatedAt: new Date()
    });

    const user = await this.userRepo.createGuest(newUser);

    return this.generateToken(user);
  }

  private generateToken(user: User): AuthResponse {
    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
      sub: user.id
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(dto.email);

    const passwordHash = user ? await this.userRepo.getPasswordHash(user.id) : null;

    if (!user || !passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
      sub: user.id
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
  }
}
