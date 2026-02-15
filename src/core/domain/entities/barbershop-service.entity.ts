interface BarbershopServiceProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  priceInCents: number;
  durationMinutes: number;
  barbershopId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class BarbershopService {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string | null;
  readonly priceInCents: number;
  readonly durationMinutes: number;
  readonly barbershopId: string;
  readonly deletedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: BarbershopServiceProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.priceInCents = props.priceInCents;
    this.durationMinutes = props.durationMinutes;
    this.barbershopId = props.barbershopId;
    this.deletedAt = props.deletedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  priceInReais(): number {
    return this.priceInCents / 100;
  }
}
