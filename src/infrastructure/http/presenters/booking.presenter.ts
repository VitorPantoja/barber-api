import { type Booking } from '../../../core/domain/entities';

export class BookingPresenter {
  static toHttp(this: void, booking: Booking) {
    return {
      barberId: booking.barberId,
      barbershopId: booking.barbershopId,
      cancelledAt: booking.cancelledAt,
      createdAt: booking.createdAt.toISOString(),
      date: booking.date.toISOString(),
      endTime: booking.endTime,
      id: booking.id,
      serviceId: booking.serviceId,
      startTime: booking.startTime,
      status: booking.status,
      stripeChargeId: booking.stripeChargeId,
      updatedAt: booking.updatedAt.toISOString(),
      userId: booking.userId
    };
  }

  static toHttpList(this: void, bookings: Booking[]) {
    return bookings.map(booking => BookingPresenter.toHttp(booking));
  }
}
