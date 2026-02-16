import { OperatingHours } from '../../../core/domain/entities';
import { type DayOfWeek } from '../../../core/domain/enums';
import { type OperatingHours as PrismaOperatingHours } from '../../../generated/prisma/client';

export class OperatingHoursMapper {
  static toDomain(prisma: PrismaOperatingHours): OperatingHours {
    return new OperatingHours({
      barbershopId: prisma.barbershopId,
      closeTime: prisma.closeTime,
      dayOfWeek: prisma.dayOfWeek as DayOfWeek,
      id: prisma.id,
      isClosed: prisma.isClosed,
      lunchEnd: null,
      lunchStart: null,
      openTime: prisma.openTime
    });
  }
}
