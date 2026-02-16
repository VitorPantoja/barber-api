import { Inject, Injectable } from '@nestjs/common';

import { BarbershopService } from '../../../core/domain/entities';
import { IBarbershopServiceRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.constants';
import { BarbershopServiceMapper } from '../mappers/barbershop-service.mapper';

@Injectable()
export class BarbershopServiceRepository implements IBarbershopServiceRepository {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<BarbershopService | null> {
    const service = await this.prisma.barbershopService.findUnique({
      where: { id }
    });

    if (!service || service.deletedAt) return null;

    return BarbershopServiceMapper.toDomain(service);
  }

  async findByBarbershop(barbershopId: string): Promise<BarbershopService[]> {
    const services = await this.prisma.barbershopService.findMany({
      where: {
        barbershopId,
        deletedAt: null
      }
    });

    return services.map(s => BarbershopServiceMapper.toDomain(s));
  }

  async searchByName(query: string): Promise<BarbershopService[]> {
    const services = await this.prisma.barbershopService.findMany({
      include: { barbershop: true },
      where: {
        deletedAt: null,
        name: { contains: query, mode: 'insensitive' }
      }
    });

    return services.map(s => BarbershopServiceMapper.toDomain(s));
  }

  async create(service: BarbershopService): Promise<BarbershopService> {
    const created = await this.prisma.barbershopService.create({
      data: {
        barbershopId: service.barbershopId,
        createdAt: service.createdAt,
        description: service.description,
        durationMinutes: service.durationMinutes,
        imageUrl: service.imageUrl,
        name: service.name,
        priceInCents: service.priceInCents,
        updatedAt: service.updatedAt
      }
    });

    return BarbershopServiceMapper.toDomain(created);
  }

  async update(service: BarbershopService): Promise<BarbershopService> {
    const updated = await this.prisma.barbershopService.update({
      data: {
        description: service.description,
        durationMinutes: service.durationMinutes,
        imageUrl: service.imageUrl,
        name: service.name,
        priceInCents: service.priceInCents,
        updatedAt: new Date()
      },
      where: { id: service.id }
    });

    return BarbershopServiceMapper.toDomain(updated);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.barbershopService.update({
      data: { deletedAt: new Date() },
      where: { id }
    });
  }
}
