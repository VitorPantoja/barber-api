import { v4 as uuid } from 'uuid';

import { BarbershopService } from '../../domain/entities';
import { type IBarbershopServiceRepository } from '../../domain/repositories';
import { created, notFound, type Result, success, successNoContent } from '../../domain/result';
import { type CreateServiceCommand } from '../commands';
import { ICatalogService } from '../ports/catalog.service.port';

export class CatalogService extends ICatalogService {
  constructor(private readonly serviceRepo: IBarbershopServiceRepository) {
    super();
  }

  async create(command: CreateServiceCommand): Promise<Result<BarbershopService>> {
    const service = new BarbershopService({
      barbershopId: command.barbershopId,
      createdAt: new Date(),
      deletedAt: null,
      description: command.description,
      durationMinutes: command.durationMinutes,
      id: uuid(),
      imageUrl: command.imageUrl ?? null,
      name: command.name,
      priceInCents: command.priceInCents,
      updatedAt: new Date()
    });

    const saved = await this.serviceRepo.create(service);
    return created(saved);
  }

  async findByBarbershop(barbershopId: string): Promise<Result<BarbershopService[]>> {
    const services = await this.serviceRepo.findByBarbershop(barbershopId);
    return success(services);
  }

  async search(query: string): Promise<Result<BarbershopService[]>> {
    const services = await this.serviceRepo.searchByName(query);
    return success(services);
  }

  async softDelete(id: string): Promise<Result<void>> {
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      return notFound('Service not found');
    }

    await this.serviceRepo.softDelete(id);
    return successNoContent();
  }
}
