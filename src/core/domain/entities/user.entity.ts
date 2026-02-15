import { USER_ROLE, type UserRole } from '../enums';

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
    return this.role === USER_ROLE.CUSTOMER;
  }

  isAdmin(): boolean {
    return this.role === USER_ROLE.ADMIN;
  }

  isCompanyAdmin(): boolean {
    return this.role === USER_ROLE.COMPANY_ADMIN;
  }

  isBarber(): boolean {
    return this.role === USER_ROLE.BARBER;
  }

  isTenantMember(): boolean {
    return this.role === USER_ROLE.COMPANY_ADMIN || this.role === USER_ROLE.BARBER;
  }

  belongsTo(barbershopId: string): boolean {
    return this.barbershopId === barbershopId;
  }
}
