import { type BarbershopService } from '../entities';

export abstract class IBarbershopServiceRepository {
  abstract findById(id: string): Promise<BarbershopService | null>;
  abstract findByBarbershop(barbershopId: string): Promise<BarbershopService[]>;
  abstract searchByName(query: string): Promise<BarbershopService[]>;
  abstract create(service: BarbershopService): Promise<BarbershopService>;
  abstract update(service: BarbershopService): Promise<BarbershopService>;
  abstract softDelete(id: string): Promise<void>;
}
