import { type OperatingHours } from '../entities';
import { type DayOfWeek } from '../enums';

export abstract class IOperatingHoursRepository {
  abstract findByBarbershop(barbershopId: string): Promise<OperatingHours[]>;
  abstract findByBarbershopAndDay(params: {
    barbershopId: string;
    dayOfWeek: DayOfWeek;
  }): Promise<OperatingHours | null>;
  abstract upsert(operatingHours: OperatingHours): Promise<OperatingHours>;
  abstract upsertMany(operatingHours: OperatingHours[]): Promise<void>;
}
