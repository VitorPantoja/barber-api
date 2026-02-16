import { Module } from '@nestjs/common';

import { IBookingService } from '../../../core/application/ports/booking.service.port';
import { BookingService } from '../../../core/application/services/booking.service';
import { BookingController } from '../../http/controllers/booking.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [BookingController],
  imports: [AuthModule, DatabaseModule],
  providers: [
    {
      provide: IBookingService,
      useClass: BookingService
    }
  ]
})
export class BookingModule {}
