import { Inject, Injectable } from '@nestjs/common';

import { type PaginatedResult, type PaginationQuery } from '../../../core/application/dtos/pagination.dto';
import { type User } from '../../../core/domain/entities';
import { IUserRepository } from '../../../core/domain/repositories';
import { type PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.module';
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
}
