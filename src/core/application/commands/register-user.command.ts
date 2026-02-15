import { type UserRole } from '../../domain/enums';

export interface RegisterUserCommand {
  name: string;
  email: string;
  role?: UserRole;
  barbershopId?: string;
}
