import { type Barbershop } from '../entities';

export abstract class IBarbershopRepository {
  abstract findById(id: string): Promise<Barbershop | null>;
  abstract findBySlug(slug: string): Promise<Barbershop | null>;
  abstract findActive(): Promise<Barbershop[]>;
  abstract create(barbershop: Barbershop): Promise<Barbershop>;
  abstract update(barbershop: Barbershop): Promise<Barbershop>;
}
