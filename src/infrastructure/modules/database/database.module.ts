import { Pool } from 'pg';

import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import {
  IBarbershopRepository,
  IBarbershopServiceRepository,
  IBookingRepository,
  IOperatingHoursRepository,
  IUserRepository
} from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { BarbershopServiceRepository } from '../../database/repositories/barbershop-service.repository';
import { BarbershopRepository } from '../../database/repositories/barbershop.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { OperatingHoursRepository } from '../../database/repositories/operating-hours.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { PRISMA_TOKEN } from './database.constants';

export { PRISMA_TOKEN };
@Global()
@Module({
  exports: [
    PRISMA_TOKEN,
    IUserRepository,
    IBarbershopRepository,
    IBarbershopServiceRepository,
    IBookingRepository,
    IOperatingHoursRepository
  ],
  providers: [
    {
      provide: PRISMA_TOKEN,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        return prisma;
      }
    },
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    {
      provide: IBarbershopRepository,
      useClass: BarbershopRepository
    },
    {
      provide: IBarbershopServiceRepository,
      useClass: BarbershopServiceRepository
    },
    {
      provide: IBookingRepository,
      useClass: BookingRepository
    },
    {
      provide: IOperatingHoursRepository,
      useClass: OperatingHoursRepository
    }
  ]
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
