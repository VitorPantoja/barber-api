import { v4 as uuid } from 'uuid';

import { Booking } from '../../domain/entities';
import { BOOKING_STATUS, DAY_OF_WEEK, type DayOfWeek } from '../../domain/enums';
import {
  type IBarbershopServiceRepository,
  type IBookingRepository,
  type IOperatingHoursRepository
} from '../../domain/repositories';
import { created, error, notFound, type Result, success } from '../../domain/result';
import { AvailabilityDomainService } from '../../domain/services/availability.domain-service';
import { type CreateBookingCommand } from '../commands';
import { IBookingService } from '../ports/booking.service.port';

const DAY_MAP: Record<number, DayOfWeek> = {
  0: DAY_OF_WEEK.SUNDAY,
  1: DAY_OF_WEEK.MONDAY,
  2: DAY_OF_WEEK.TUESDAY,
  3: DAY_OF_WEEK.WEDNESDAY,
  4: DAY_OF_WEEK.THURSDAY,
  5: DAY_OF_WEEK.FRIDAY,
  6: DAY_OF_WEEK.SATURDAY
};

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export class BookingService extends IBookingService {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly serviceRepo: IBarbershopServiceRepository,
    private readonly operatingHoursRepo: IOperatingHoursRepository
  ) {
    super();
  }

  async create(command: CreateBookingCommand): Promise<Result<Booking>> {
    const service = await this.serviceRepo.findById(command.serviceId);
    if (!service) {
      return notFound('Service not found');
    }

    if (service.isDeleted()) {
      return error('Service is no longer available');
    }

    const dayOfWeek = DAY_MAP[command.date.getDay()];
    const operatingHours = await this.operatingHoursRepo.findByBarbershopAndDay({
      barbershopId: command.barbershopId,
      dayOfWeek
    });

    if (!operatingHours || !operatingHours.isOpen()) {
      return error('Barbershop is closed on this day');
    }

    const existingBookings = await this.bookingRepo.findByBarberAndDate({
      barberId: command.barberId,
      date: command.date
    });

    const availableSlots = AvailabilityDomainService.getAvailableSlots({
      durationMinutes: service.durationMinutes,
      existingBookings,
      operatingHours
    });

    const isSlotAvailable = availableSlots.some(s => s.startTime === command.startTime);
    if (!isSlotAvailable) {
      return error('Selected time slot is not available');
    }

    const endTime = Booking.computeEndTime({
      durationMinutes: service.durationMinutes,
      startTime: command.startTime
    });

    const booking = new Booking({
      barberId: command.barberId,
      barbershopId: command.barbershopId,
      cancelledAt: null,
      createdAt: new Date(),
      date: command.date,
      endTime,
      id: uuid(),
      serviceId: command.serviceId,
      startTime: command.startTime,
      status: BOOKING_STATUS.CONFIRMED,
      stripeChargeId: null,
      updatedAt: new Date(),
      userId: command.userId
    });

    const saved = await this.bookingRepo.create(booking);
    return created(saved);
  }

  async cancel({ bookingId, userId }: { bookingId: string; userId: string }): Promise<Result<Booking>> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      return notFound('Booking not found');
    }

    if (booking.userId !== userId) {
      return error('You can only cancel your own bookings');
    }

    if (!booking.canCancel(new Date())) {
      return error('Booking can only be cancelled at least 2 hours before the scheduled time');
    }

    const updated = await this.bookingRepo.updateStatus({
      cancelledAt: new Date(),
      id: bookingId,
      status: BOOKING_STATUS.CANCELLED
    });

    return success(updated);
  }

  async findByUser(userId: string): Promise<Result<Booking[]>> {
    const bookings = await this.bookingRepo.findByUserId(userId);
    return success(bookings);
  }

  async findBarberAgenda({ barberId, date }: { barberId: string; date: Date }): Promise<Result<Booking[]>> {
    const bookings = await this.bookingRepo.findByBarberAndDate({ barberId, date });
    const confirmed = bookings.filter(b => b.isConfirmed());
    return success(confirmed);
  }

  async getAvailableSlots({
    barberId,
    barbershopId,
    date,
    serviceId
  }: {
    barbershopId: string;
    serviceId: string;
    barberId: string;
    date: Date;
  }): Promise<Result<TimeSlot[]>> {
    const service = await this.serviceRepo.findById(serviceId);
    if (!service) {
      return notFound('Service not found');
    }

    const dayOfWeek = DAY_MAP[date.getDay()];
    const operatingHours = await this.operatingHoursRepo.findByBarbershopAndDay({
      barbershopId,
      dayOfWeek
    });

    if (!operatingHours || !operatingHours.isOpen()) {
      return success([]);
    }

    const existingBookings = await this.bookingRepo.findByBarberAndDate({
      barberId,
      date
    });

    const slots = AvailabilityDomainService.getAvailableSlots({
      durationMinutes: service.durationMinutes,
      existingBookings,
      operatingHours
    });

    return success(slots);
  }
}
