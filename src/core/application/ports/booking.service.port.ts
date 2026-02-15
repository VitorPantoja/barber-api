import { type Booking } from '../../domain/entities';
import { type Result } from '../../domain/result';
import { type CreateBookingCommand } from '../commands';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export abstract class IBookingService {
  abstract create(command: CreateBookingCommand): Promise<Result<Booking>>;
  abstract cancel(params: { bookingId: string; userId: string }): Promise<Result<Booking>>;
  abstract findByUser(userId: string): Promise<Result<Booking[]>>;
  abstract findBarberAgenda(params: { barberId: string; date: Date }): Promise<Result<Booking[]>>;
  abstract getAvailableSlots(params: {
    barbershopId: string;
    serviceId: string;
    barberId: string;
    date: Date;
  }): Promise<Result<TimeSlot[]>>;
}
