import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities';
import { USER_ROLE } from '../../domain/enums';
import { IUserRepository } from '../../domain/repositories';
import { alreadyExists, created, notFound, success, successNoContent, type Result } from '../../domain/result';
import { type RegisterUserCommand } from '../commands';
import { type UpdateUserCommand } from '../commands/update-user.command';
import { type PaginatedResult, type PaginationQuery } from '../dtos/pagination.dto';
import { IUserService } from '../ports/user.service.port';

@Injectable()
export class UserService extends IUserService {
  constructor(private readonly userRepo: IUserRepository) {
    super();
  }

  async register(command: RegisterUserCommand): Promise<Result<User>> {
    const existing = await this.userRepo.findByEmail(command.email);
    if (existing) {
      return alreadyExists('User with this email already exists');
    }

    const user = new User({
      barbershopId: command.barbershopId ?? null,
      createdAt: new Date(),
      email: command.email,
      emailVerified: false,
      id: uuid(),
      image: null,
      name: command.name,
      role: command.role ?? USER_ROLE.CUSTOMER,
      updatedAt: new Date()
    });

    const saved = await this.userRepo.create(user);
    return created(saved);
  }

  async findById(id: string): Promise<Result<User>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      return notFound('User not found');
    }

    return success(user);
  }

  async findAll(query: PaginationQuery): Promise<Result<PaginatedResult<User>>> {
    const result = await this.userRepo.findPaginated(query);
    return success(result);
  }

  async update({ command, id }: { id: string; command: UpdateUserCommand }): Promise<Result<User>> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      return notFound('User not found');
    }

    const updated = new User({
      barbershopId: existing.barbershopId,
      createdAt: existing.createdAt,
      email: existing.email,
      emailVerified: existing.emailVerified,
      id: existing.id,
      image: command.image !== undefined ? command.image : existing.image,
      name: command.name ?? existing.name,
      role: existing.role,
      updatedAt: new Date()
    });

    const saved = await this.userRepo.update(updated);
    return success(saved);
  }

  async delete(id: string): Promise<Result<void>> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      return notFound('User not found');
    }

    await this.userRepo.delete(id);
    return successNoContent();
  }
}
