import { type Barbershop, type BarbershopProps } from '../entities';

export abstract class IBarbershopRepository {
  abstract findById(id: string): Promise<Barbershop | null>;
  abstract findBySlug(slug: string): Promise<Barbershop | null>;
  abstract findActive(): Promise<Barbershop[]>;
  abstract create(
    barbershop: Omit<BarbershopProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Barbershop>;
  abstract update(barbershop: Barbershop): Promise<Barbershop>;
  abstract delete(id: string): Promise<void>;
  abstract erase(id: string): Promise<void>;
}
