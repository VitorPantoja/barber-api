import { type Booking } from '../entities';

export abstract class IBookingRepository {
  abstract findById(id: string): Promise<Booking | null>;
  abstract findByBarbershopAndDate(params: { barbershopId: string; date: Date }): Promise<Booking[]>;
  abstract findByBarberAndDate(params: { barberId: string; date: Date }): Promise<Booking[]>;
  abstract findByUserId(userId: string): Promise<Booking[]>;
  abstract create(booking: Booking): Promise<Booking>;
  abstract updateStatus(params: { id: string; status: Booking['status']; cancelledAt?: Date }): Promise<Booking>;
}
