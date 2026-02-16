import { v4 as uuid } from 'uuid';

import { Inject, Injectable } from '@nestjs/common';

import { type PaginatedResult, type PaginationQuery } from '../../../core/application/dtos/pagination.dto';
import { type User } from '../../../core/domain/entities';
import { IUserRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.constants';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    if (!raw) return null;

    return UserMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    if (!raw) return null;

    return UserMapper.toDomain(raw);
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return records.map(function (item) {
      return UserMapper.toDomain(item);
    });
  }

  async findPaginated(query: PaginationQuery): Promise<PaginatedResult<User>> {
    const skip = (query.page - 1) * query.limit;

    const [records, total] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit
      }),
      this.prisma.user.count()
    ]);

    const mapped = records.map(function (item) {
      return UserMapper.toDomain(item);
    });

    return {
      data: mapped,
      limit: query.limit,
      page: query.page,
      total
    };
  }

  async create(user: User): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        barbershopId: user.barbershopId,
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.id,
        image: user.image,
        name: user.name,
        role: user.role
      }
    });

    return UserMapper.toDomain(raw);
  }

  async update(user: User): Promise<User> {
    const raw = await this.prisma.user.update({
      data: {
        emailVerified: user.emailVerified,
        image: user.image,
        name: user.name,
        role: user.role
      },
      where: { id: user.id }
    });

    return UserMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async createWithPassword(user: User, passwordHash: string): Promise<User> {
    const createdUser = await this.prisma.$transaction(async function (tx) {
      const newUser = await tx.user.create({
        data: {
          barbershopId: user.barbershopId,
          email: user.email,
          emailVerified: user.emailVerified,
          id: user.id,
          image: user.image,
          name: user.name,
          role: user.role
        }
      });

      await tx.account.create({
        data: {
          accountId: newUser.id,
          createdAt: new Date(),
          id: uuid(),
          password: passwordHash,
          providerId: 'credential',
          updatedAt: new Date(),
          userId: newUser.id
        }
      });

      return newUser;
    });

    return UserMapper.toDomain(createdUser);
  }

  async getPasswordHash(userId: string): Promise<string | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        providerId: 'credential',
        userId
      }
    });

    return account?.password || null;
  }

  async createGuest(user: User): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        barbershopId: user.barbershopId,
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.id,
        image: user.image,
        name: user.name,
        role: user.role
      }
    });

    return UserMapper.toDomain(raw);
  }

  async findBySessionToken(token: string): Promise<User | null> {
    const session = await this.prisma.session.findUnique({
      include: { user: true },
      where: { token }
    });

    if (!session || new Date() > session.expiresAt) {
      return null;
    }

    return UserMapper.toDomain(session.user);
  }
}
