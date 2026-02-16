import { Inject, Injectable } from '@nestjs/common';

import { Booking, type BookingProps, User } from '../../../core/domain/entities';
import { IBookingRepository } from '../../../core/domain/repositories';
import { PrismaClient } from '../../../generated/prisma/client';
import { PRISMA_TOKEN } from '../../modules/database/database.constants';
import { BookingMapper } from '../mappers/booking.mapper';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(@Inject(PRISMA_TOKEN) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) return null;

    return BookingMapper.toDomain(booking);
  }

  async findByBarbershopAndDate({ barbershopId, date }: { barbershopId: string; date: Date }): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    return bookings.map(b => BookingMapper.toDomain(b));
  }

  async findByBarberAndDate({ barberId, date }: { barberId: string; date: Date }): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    return bookings.map(b => BookingMapper.toDomain(b));
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      orderBy: { date: 'desc' },
      where: { userId }
    });

    return bookings.map(b => BookingMapper.toDomain(b));
  }

  async findCustomersByBarbershop(barbershopId: string): Promise<User[]> {
    const bookings = await this.prisma.booking.findMany({
      distinct: ['userId'],
      include: { user: true },
      where: { barbershopId }
    });

    return bookings.map(b => UserMapper.toDomain(b.user));
  }

  async create(booking: Omit<BookingProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        barberId: booking.barberId,
        barbershopId: booking.barbershopId,
        cancelledAt: booking.cancelledAt,
        date: booking.date,
        endTime: booking.endTime,
        serviceId: booking.serviceId,
        startTime: booking.startTime,
        status: booking.status,
        stripeChargeId: booking.stripeChargeId,
        userId: booking.userId
      }
    });

    return BookingMapper.toDomain(created);
  }

  async updateStatus({
    cancelledAt,
    id,
    status
  }: {
    id: string;
    status: Booking['status'];
    cancelledAt?: Date;
  }): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      data: {
        cancelledAt,
        status
      },
      where: { id }
    });

    return BookingMapper.toDomain(updated);
  }
}
