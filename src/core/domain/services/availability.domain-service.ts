import { Booking } from '../entities/booking.entity';
import { type OperatingHours } from '../entities/operating-hours.entity';

interface AvailabilityInput {
  operatingHours: OperatingHours;
  existingBookings: Booking[];
  durationMinutes: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export class AvailabilityDomainService {
  static getAvailableSlots({ durationMinutes, existingBookings, operatingHours }: AvailabilityInput): TimeSlot[] {
    const candidateSlots = operatingHours.getSlots(durationMinutes);

    const confirmedBookings = existingBookings.filter(b => b.isConfirmed());

    return candidateSlots
      .map(startTime => ({
        endTime: Booking.computeEndTime({ durationMinutes, startTime }),
        startTime
      }))
      .filter(slot => !this.overlapsWithAny(slot, confirmedBookings));
  }

  private static overlapsWithAny(slot: TimeSlot, bookings: Booking[]): boolean {
    return bookings.some(booking => this.overlaps(slot, booking));
  }

  private static overlaps(slot: TimeSlot, booking: Booking): boolean {
    return slot.startTime < booking.endTime && slot.endTime > booking.startTime;
  }
}
