import { type PaginatedResult, type PaginationQuery } from '../../application/dtos/pagination.dto';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findPaginated(params: PaginationQuery): Promise<PaginatedResult<T>>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
