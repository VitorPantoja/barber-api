import { BOOKING_STATUS, type BookingStatus } from '../enums';

const CANCELLATION_WINDOW_HOURS = 2;

export interface BookingProps {
  id: string;
  status: BookingStatus;
  barbershopId: string;
  serviceId: string;
  barberId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  stripeChargeId: string | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Booking {
  readonly id: string;
  readonly status: BookingStatus;
  readonly barbershopId: string;
  readonly serviceId: string;
  readonly barberId: string;
  readonly userId: string;
  readonly date: Date;
  readonly startTime: string;
  readonly endTime: string;
  readonly stripeChargeId: string | null;
  readonly cancelledAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: BookingProps) {
    this.id = props.id;
    this.status = props.status;
    this.barbershopId = props.barbershopId;
    this.serviceId = props.serviceId;
    this.barberId = props.barberId;
    this.userId = props.userId;
    this.date = props.date;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.stripeChargeId = props.stripeChargeId;
    this.cancelledAt = props.cancelledAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  canCancel(now: Date): boolean {
    if (this.status !== BOOKING_STATUS.CONFIRMED) {
      return false;
    }

    const bookingDateTime = this.buildDateTime();
    const diffMs = bookingDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= CANCELLATION_WINDOW_HOURS;
  }

  isInPast(now: Date): boolean {
    return this.buildDateTime().getTime() < now.getTime();
  }

  isConfirmed(): boolean {
    return this.status === BOOKING_STATUS.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.status === BOOKING_STATUS.CANCELLED;
  }

  static computeEndTime({ durationMinutes, startTime }: { startTime: string; durationMinutes: number }): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  private buildDateTime(): Date {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const dateTime = new Date(this.date);
    dateTime.setHours(hours, minutes, 0, 0);

    return dateTime;
  }
}
