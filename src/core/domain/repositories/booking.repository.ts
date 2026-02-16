import { type Booking, type BookingProps, type User } from '../entities';

export abstract class IBookingRepository {
  abstract findById(id: string): Promise<Booking | null>;
  abstract findByBarbershopAndDate(params: { barbershopId: string; date: Date }): Promise<Booking[]>;
  abstract findByBarberAndDate(params: { barberId: string; date: Date }): Promise<Booking[]>;
  abstract findByUserId(userId: string): Promise<Booking[]>;
  abstract findCustomersByBarbershop(barbershopId: string): Promise<User[]>;
  abstract create(booking: Omit<BookingProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking>;
  abstract updateStatus(params: { id: string; status: Booking['status']; cancelledAt?: Date }): Promise<Booking>;
}
