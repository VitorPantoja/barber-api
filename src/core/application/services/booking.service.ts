import { Injectable } from '@nestjs/common';

import { DAY_MAP } from '../../domain/consts';
import { Booking } from '../../domain/entities';
import { BOOKING_STATUS } from '../../domain/enums';
import {
  IBarbershopRepository,
  IBarbershopServiceRepository,
  IBookingRepository,
  IOperatingHoursRepository,
  IUserRepository
} from '../../domain/repositories';
import { created, error, notFound, success, type Result } from '../../domain/result';
import { AvailabilityDomainService } from '../../domain/services/availability.domain-service';
import { type CreateBookingCommand } from '../commands';
import { IBookingService } from '../ports/booking.service.port';
interface TimeSlot {
  startTime: string;
  endTime: string;
}

@Injectable()
export class BookingService extends IBookingService {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly barbershopRepo: IBarbershopRepository,
    private readonly serviceRepo: IBarbershopServiceRepository,
    private readonly operatingHoursRepo: IOperatingHoursRepository,
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  async create(command: CreateBookingCommand): Promise<Result<Booking>> {
    const userId = command.userId;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      return notFound('User not found');
    }

    const barbershop = await this.barbershopRepo.findById(command.barbershopId);
    if (!barbershop) {
      return notFound('Barbershop not found');
    }

    if (!barbershop.canAcceptBookings()) {
      return error('Barbershop is not active or subscription is past due');
    }

    const service = await this.serviceRepo.findById(command.serviceId);
    if (!service) {
      return notFound('Service not found');
    }

    if (service.isDeleted()) {
      return error('Service is no longer available');
    }

    const barber = await this.userRepo.findById(command.barberId);
    if (!barber) {
      return notFound('Barber not found');
    }

    if (!barber.isProvider()) {
      return error('Selected user is not a valid service provider');
    }

    if (!barber.belongsTo(command.barbershopId)) {
      return error('Barber does not belong to this barbershop');
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

    const booking = {
      barberId: command.barberId,
      barbershopId: command.barbershopId,
      cancelledAt: null,
      date: command.date,
      endTime,
      serviceId: command.serviceId,
      startTime: command.startTime,
      status: BOOKING_STATUS.CONFIRMED,
      stripeChargeId: null,
      userId: command.userId
    };

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
