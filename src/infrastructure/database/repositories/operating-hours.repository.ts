import { Inject, Injectable } from '@nestjs/common';

import { OperatingHours } from '../../../core/domain/entities';
import { type DayOfWeek } from '../../../core/domain/enums';
import { IOperatingHoursRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.constants';
import { OperatingHoursMapper } from '../mappers/operating-hours.mapper';

@Injectable()
export class OperatingHoursRepository implements IOperatingHoursRepository {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async findByBarbershop(barbershopId: string): Promise<OperatingHours[]> {
    const hours = await this.prisma.operatingHours.findMany({
      where: { barbershopId }
    });

    return hours.map(h => OperatingHoursMapper.toDomain(h));
  }

  async findByBarbershopAndDay({
    barbershopId,
    dayOfWeek
  }: {
    barbershopId: string;
    dayOfWeek: DayOfWeek;
  }): Promise<OperatingHours | null> {
    const hours = await this.prisma.operatingHours.findFirst({
      where: {
        barbershopId,
        dayOfWeek
      }
    });

    if (!hours) return null;

    return OperatingHoursMapper.toDomain(hours);
  }

  async upsert(operatingHours: OperatingHours): Promise<OperatingHours> {
    const data = {
      barbershopId: operatingHours.barbershopId,
      closeTime: operatingHours.closeTime,
      dayOfWeek: operatingHours.dayOfWeek,
      isClosed: operatingHours.isClosed,
      openTime: operatingHours.openTime
    };

    const saved = await this.prisma.operatingHours.upsert({
      create: data,
      update: data,
      where: {
        // eslint-disable-next-line camelcase
        barbershopId_dayOfWeek: {
          barbershopId: operatingHours.barbershopId,
          dayOfWeek: operatingHours.dayOfWeek
        }
      }
    });

    return OperatingHoursMapper.toDomain(saved);
  }

  async upsertMany(operatingHours: OperatingHours[]): Promise<void> {
    const ops = operatingHours.map(oh => {
      const data = {
        barbershopId: oh.barbershopId,
        closeTime: oh.closeTime,
        dayOfWeek: oh.dayOfWeek,
        isClosed: oh.isClosed,
        openTime: oh.openTime
      };

      return this.prisma.operatingHours.upsert({
        create: data,
        update: data,
        where: {
          // eslint-disable-next-line camelcase
          barbershopId_dayOfWeek: {
            barbershopId: oh.barbershopId,
            dayOfWeek: oh.dayOfWeek
          }
        }
      });
    });

    await this.prisma.$transaction(ops);
  }
}
