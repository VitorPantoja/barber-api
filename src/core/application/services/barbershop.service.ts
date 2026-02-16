import { Injectable } from '@nestjs/common';

import { Barbershop, User } from '../../domain/entities';
import { SUBSCRIPTION_STATUS } from '../../domain/enums';
import { IBarbershopRepository, IBookingRepository } from '../../domain/repositories';
import { alreadyExists, created, notFound, type Result, success, successNoContent } from '../../domain/result';
import { type CreateBarbershopCommand } from '../commands';
import { IBarbershopService } from '../ports/barbershop.service.port';

@Injectable()
export class BarbershopService extends IBarbershopService {
  constructor(
    private readonly barbershopRepo: IBarbershopRepository,
    private readonly bookingRepo: IBookingRepository
  ) {
    super();
  }

  async create(command: CreateBarbershopCommand): Promise<Result<Barbershop>> {
    const existing = await this.barbershopRepo.findBySlug(command.slug);
    if (existing) {
      return alreadyExists(`Barbershop with slug "${command.slug}" already exists`);
    }

    const barbershop = {
      address: command.address,
      description: command.description,
      imageUrl: command.imageUrl,
      logoUrl: command.logoUrl ?? null,
      name: command.name,
      operatingHours: [],
      phones: command.phones,
      slug: command.slug,
      stripeCustomerId: null,
      subscriptionStatus: SUBSCRIPTION_STATUS.TRIALING,
      themeColor: command.themeColor ?? '#000000'
    };

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

  async update(id: string, command: Partial<CreateBarbershopCommand>): Promise<Result<Barbershop>> {
    const barbershop = await this.barbershopRepo.findById(id);
    if (!barbershop) {
      return notFound(`Barbershop with id "${id}" not found`);
    }

    const updated = new Barbershop({
      ...barbershop,
      ...command,
      updatedAt: new Date()
    });

    const saved = await this.barbershopRepo.update(updated);
    return success(saved);
  }

  async delete(id: string): Promise<Result<void>> {
    const barbershop = await this.barbershopRepo.findById(id);
    if (!barbershop) return notFound(`Barbershop not found`);

    await this.barbershopRepo.delete(id);
    return successNoContent();
  }

  async erase(id: string): Promise<Result<void>> {
    const barbershop = await this.barbershopRepo.findById(id);
    if (!barbershop) return notFound(`Barbershop not found`);

    await this.barbershopRepo.erase(id);
    return successNoContent();
  }

  async getCustomers(barbershopId: string): Promise<Result<User[]>> {
    const barbershop = await this.barbershopRepo.findById(barbershopId);
    if (!barbershop) {
      return notFound(`Barbershop not found`);
    }

    const customers = await this.bookingRepo.findCustomersByBarbershop(barbershopId);
    return success(customers);
  }
}
