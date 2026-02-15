import { type User } from '../../domain/entities';
import { type Result } from '../../domain/result';
import { type RegisterUserCommand } from '../commands';
import { type UpdateUserCommand } from '../commands/update-user.command';
import { type PaginatedResult, type PaginationQuery } from '../dtos/pagination.dto';

export abstract class IUserService {
  abstract register(command: RegisterUserCommand): Promise<Result<User>>;
  abstract findById(id: string): Promise<Result<User>>;
  abstract findAll(query: PaginationQuery): Promise<Result<PaginatedResult<User>>>;
  abstract update(params: { id: string; command: UpdateUserCommand }): Promise<Result<User>>;
  abstract delete(id: string): Promise<Result<void>>;
}
