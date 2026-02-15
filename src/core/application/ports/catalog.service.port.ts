import { type BarbershopService } from '../../domain/entities';
import { type Result } from '../../domain/result';
import { type CreateServiceCommand } from '../commands';

export abstract class ICatalogService {
  abstract create(command: CreateServiceCommand): Promise<Result<BarbershopService>>;
  abstract findByBarbershop(barbershopId: string): Promise<Result<BarbershopService[]>>;
  abstract search(query: string): Promise<Result<BarbershopService[]>>;
  abstract softDelete(id: string): Promise<Result<void>>;
}
