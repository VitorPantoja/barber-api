import { UserRole } from '../enums';

interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  barbershopId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
  readonly role: UserRole;
  readonly barbershopId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.emailVerified = props.emailVerified;
    this.image = props.image;
    this.role = props.role;
    this.barbershopId = props.barbershopId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isCompanyAdmin(): boolean {
    return this.role === UserRole.COMPANY_ADMIN;
  }

  isBarber(): boolean {
    return this.role === UserRole.BARBER;
  }

  isTenantMember(): boolean {
    return this.role === UserRole.COMPANY_ADMIN || this.role === UserRole.BARBER;
  }

  belongsTo(barbershopId: string): boolean {
    return this.barbershopId === barbershopId;
  }
}
