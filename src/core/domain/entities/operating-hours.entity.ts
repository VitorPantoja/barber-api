import { type DayOfWeek } from '../enums';

interface OperatingHoursProps {
  id: string;
  barbershopId: string;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export class OperatingHours {
  readonly id: string;
  readonly barbershopId: string;
  readonly dayOfWeek: DayOfWeek;
  readonly openTime: string;
  readonly closeTime: string;
  readonly isClosed: boolean;

  constructor(props: OperatingHoursProps) {
    this.id = props.id;
    this.barbershopId = props.barbershopId;
    this.dayOfWeek = props.dayOfWeek;
    this.openTime = props.openTime;
    this.closeTime = props.closeTime;
    this.isClosed = props.isClosed;
  }

  isOpen(): boolean {
    return !this.isClosed;
  }

  getSlots(durationMinutes: number): string[] {
    if (this.isClosed) {
      return [];
    }

    const slots: string[] = [];
    const [openH, openM] = this.openTime.split(':').map(Number);
    const [closeH, closeM] = this.closeTime.split(':').map(Number);
    const openTotal = openH * 60 + openM;
    const closeTotal = closeH * 60 + closeM;

    for (let t = openTotal; t + durationMinutes <= closeTotal; t += durationMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }

    return slots;
  }
}
