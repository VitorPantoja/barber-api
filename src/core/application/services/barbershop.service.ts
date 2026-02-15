import { v4 as uuid } from 'uuid';

import { Barbershop } from '../../domain/entities';
import { SUBSCRIPTION_STATUS } from '../../domain/enums';
import { type IBarbershopRepository } from '../../domain/repositories';
import { alreadyExists, created, notFound, type Result, success } from '../../domain/result';
import { type CreateBarbershopCommand } from '../commands';
import { IBarbershopService } from '../ports/barbershop.service.port';

export class BarbershopService extends IBarbershopService {
  constructor(private readonly barbershopRepo: IBarbershopRepository) {
    super();
  }

  async create(command: CreateBarbershopCommand): Promise<Result<Barbershop>> {
    const existing = await this.barbershopRepo.findBySlug(command.slug);
    if (existing) {
      return alreadyExists(`Barbershop with slug "${command.slug}" already exists`);
    }

    const barbershop = new Barbershop({
      address: command.address,
      createdAt: new Date(),
      description: command.description,
      id: uuid(),
      imageUrl: command.imageUrl,
      logoUrl: command.logoUrl ?? null,
      name: command.name,
      phones: command.phones,
      slug: command.slug,
      stripeCustomerId: null,
      subscriptionStatus: SUBSCRIPTION_STATUS.TRIALING,
      themeColor: command.themeColor ?? '#000000',
      updatedAt: new Date()
    });

    const saved = await this.barbershopRepo.create(barbershop);
    return created(saved);
  }

  async findById(id: string): Promise<Result<Barbershop>> {
    const barbershop = await this.barbershopRepo.findById(id);
    if (!barbershop) {
      return notFound(`Barbershop not found`);
    }

    return success(barbershop);
  }

  async findBySlug(slug: string): Promise<Result<Barbershop>> {
    const barbershop = await this.barbershopRepo.findBySlug(slug);
    if (!barbershop) {
      return notFound(`Barbershop not found`);
    }

    return success(barbershop);
  }

  async findActive(): Promise<Result<Barbershop[]>> {
    const barbershops = await this.barbershopRepo.findActive();
    return success(barbershops);
  }
}
