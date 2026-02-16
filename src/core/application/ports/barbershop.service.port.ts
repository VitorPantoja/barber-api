import { type Barbershop, type User } from '../../domain/entities';
import { type Result } from '../../domain/result';
import { type CreateBarbershopCommand } from '../commands';

export abstract class IBarbershopService {
  abstract create(command: CreateBarbershopCommand): Promise<Result<Barbershop>>;
  abstract findById(id: string): Promise<Result<Barbershop>>;
  abstract findBySlug(slug: string): Promise<Result<Barbershop>>;
  abstract findActive(): Promise<Result<Barbershop[]>>;
  abstract update(id: string, command: Partial<CreateBarbershopCommand>): Promise<Result<Barbershop>>;
  abstract delete(id: string): Promise<Result<void>>;
  abstract erase(id: string): Promise<Result<void>>;
  abstract getCustomers(barbershopId: string): Promise<Result<User[]>>;
}
