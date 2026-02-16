import { Booking } from '../../../core/domain/entities';
import { type BookingStatus } from '../../../core/domain/enums/booking-status.enum';
import { type Booking as PrismaBooking } from '../../../generated/prisma/client';

export class BookingMapper {
  static toDomain(prismaBooking: PrismaBooking): Booking {
    return new Booking({
      barberId: prismaBooking.barberId,
      barbershopId: prismaBooking.barbershopId,
      cancelledAt: prismaBooking.cancelledAt,
      createdAt: prismaBooking.createdAt,
      date: prismaBooking.date,
      endTime: prismaBooking.endTime,
      id: prismaBooking.id,
      serviceId: prismaBooking.serviceId,
      startTime: prismaBooking.startTime,
      status: prismaBooking.status as BookingStatus,
      stripeChargeId: prismaBooking.stripeChargeId,
      updatedAt: prismaBooking.updatedAt,
      userId: prismaBooking.userId
    });
  }
}
