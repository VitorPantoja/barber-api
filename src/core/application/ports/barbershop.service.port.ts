import { type Barbershop } from '../../domain/entities';
import { type Result } from '../../domain/result';
import { type CreateBarbershopCommand } from '../commands';

export abstract class IBarbershopService {
  abstract create(command: CreateBarbershopCommand): Promise<Result<Barbershop>>;
  abstract findById(id: string): Promise<Result<Barbershop>>;
  abstract findBySlug(slug: string): Promise<Result<Barbershop>>;
  abstract findActive(): Promise<Result<Barbershop[]>>;
}
