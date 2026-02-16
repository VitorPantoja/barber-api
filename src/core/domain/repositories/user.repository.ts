import { type PaginatedResult, type PaginationQuery } from '../../application/dtos/pagination.dto';
import { type User } from '../entities';
import { type IRepository } from '../ports/repository.port';

export abstract class IUserRepository implements IRepository<User> {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findPaginated(params: PaginationQuery): Promise<PaginatedResult<User>>;
  abstract create(entity: User): Promise<User>;
  abstract update(entity: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract createWithPassword(user: User, passwordHash: string): Promise<User>;
  abstract createGuest(user: User): Promise<User>;
  abstract getPasswordHash(userId: string): Promise<string | null>;
  abstract findBySessionToken(token: string): Promise<User | null>;
}
