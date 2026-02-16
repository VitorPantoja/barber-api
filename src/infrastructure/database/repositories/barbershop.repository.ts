import { Inject, Injectable } from '@nestjs/common';

import { Barbershop, type BarbershopProps } from '../../../core/domain/entities';
import { IBarbershopRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.constants';
import { BarbershopMapper } from '../mappers/barbershop.mapper';

@Injectable()
export class BarbershopRepository implements IBarbershopRepository {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Barbershop | null> {
    const barbershop = await this.prisma.barbershop.findFirst({
      include: { operatingHours: true },
      where: { deletedAt: null, id }
    });

    if (!barbershop) return null;

    return BarbershopMapper.toDomain(barbershop);
  }

  async findBySlug(slug: string): Promise<Barbershop | null> {
    const barbershop = await this.prisma.barbershop.findFirst({
      include: { operatingHours: true },
      where: { deletedAt: null, slug }
    });

    if (!barbershop) return null;

    return BarbershopMapper.toDomain(barbershop);
  }

  async findActive(): Promise<Barbershop[]> {
    const barbershops = await this.prisma.barbershop.findMany({
      include: { operatingHours: true },
      where: {
        deletedAt: null,
        subscriptionStatus: { in: ['ACTIVE', 'TRIALING'] }
      }
    });

    return barbershops.map(b => BarbershopMapper.toDomain(b));
  }

  async create(barbershop: Omit<BarbershopProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Barbershop> {
    const created = await this.prisma.barbershop.create({
      data: {
        address: barbershop.address,
        createdAt: new Date(),
        description: barbershop.description,
        imageUrl: barbershop.imageUrl,
        logoUrl: barbershop.logoUrl,
        name: barbershop.name,
        phones: barbershop.phones,
        slug: barbershop.slug,
        stripeCustomerId: barbershop.stripeCustomerId,
        subscriptionStatus: barbershop.subscriptionStatus,
        themeColor: barbershop.themeColor,
        updatedAt: new Date()
      },
      include: { operatingHours: true }
    });

    return BarbershopMapper.toDomain(created);
  }

  async update(barbershop: Barbershop): Promise<Barbershop> {
    const updated = await this.prisma.barbershop.update({
      data: {
        address: barbershop.address,
        deletedAt: barbershop.deletedAt,
        description: barbershop.description,
        imageUrl: barbershop.imageUrl,
        logoUrl: barbershop.logoUrl,
        name: barbershop.name,
        phones: barbershop.phones,
        slug: barbershop.slug,
        stripeCustomerId: barbershop.stripeCustomerId,
        subscriptionStatus: barbershop.subscriptionStatus,
        themeColor: barbershop.themeColor,
        updatedAt: new Date()
      },
      include: { operatingHours: true },
      where: { id: barbershop.id }
    });

    return BarbershopMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.barbershop.update({
      data: { deletedAt: new Date() },
      where: { id }
    });
  }

  async erase(id: string): Promise<void> {
    await this.prisma.barbershop.delete({
      where: { id }
    });
  }
}
