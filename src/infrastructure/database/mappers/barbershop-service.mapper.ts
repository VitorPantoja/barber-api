import { BarbershopService } from '../../../core/domain/entities';
import { type BarbershopService as PrismaService } from '../../../generated/prisma/client';

export class BarbershopServiceMapper {
  static toDomain(prismaService: PrismaService): BarbershopService {
    return new BarbershopService({
      barbershopId: prismaService.barbershopId,
      createdAt: prismaService.createdAt,
      deletedAt: prismaService.deletedAt,
      description: prismaService.description,
      durationMinutes: prismaService.durationMinutes,
      id: prismaService.id,
      imageUrl: prismaService.imageUrl,
      name: prismaService.name,
      priceInCents: Number(prismaService.priceInCents),
      updatedAt: prismaService.updatedAt
    });
  }
}
