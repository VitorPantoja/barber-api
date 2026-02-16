import { Barbershop, OperatingHours } from '../../../core/domain/entities';
import { type DAY_OF_WEEK } from '../../../core/domain/enums';
import {
  type Barbershop as PrismaBarbershop,
  type OperatingHours as PrismaOperatingHours
} from '../../../generated/prisma/client';

export class BarbershopMapper {
  static toDomain(prismaBarbershop: PrismaBarbershop & { operatingHours?: PrismaOperatingHours[] }): Barbershop {
    const operatingHours =
      prismaBarbershop.operatingHours?.map(
        oh =>
          new OperatingHours({
            barbershopId: oh.barbershopId,
            closeTime: oh.closeTime,
            dayOfWeek: oh.dayOfWeek as keyof typeof DAY_OF_WEEK,
            id: oh.id,
            isClosed: oh.isClosed,
            lunchEnd: null,
            lunchStart: null,
            openTime: oh.openTime
          })
      ) || [];

    return new Barbershop({
      address: prismaBarbershop.address,
      createdAt: prismaBarbershop.createdAt,
      deletedAt: prismaBarbershop.deletedAt,
      description: prismaBarbershop.description,
      id: prismaBarbershop.id,
      imageUrl: prismaBarbershop.imageUrl,
      logoUrl: prismaBarbershop.logoUrl,
      name: prismaBarbershop.name,
      operatingHours,
      phones: prismaBarbershop.phones,
      slug: prismaBarbershop.slug,
      stripeCustomerId: prismaBarbershop.stripeCustomerId,
      subscriptionStatus: prismaBarbershop.subscriptionStatus as any,
      themeColor: prismaBarbershop.themeColor,
      updatedAt: prismaBarbershop.updatedAt
    });
  }
}
