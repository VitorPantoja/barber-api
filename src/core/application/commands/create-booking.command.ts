export interface CreateBookingCommand {
  barbershopId: string;
  serviceId: string;
  barberId: string;
  userId: string;
  date: Date;
  startTime: string;
}
