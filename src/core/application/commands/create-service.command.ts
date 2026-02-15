export interface CreateServiceCommand {
  name: string;
  description: string;
  imageUrl?: string;
  priceInCents: number;
  durationMinutes: number;
  barbershopId: string;
}
