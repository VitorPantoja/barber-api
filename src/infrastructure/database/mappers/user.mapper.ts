import { User } from '../../../core/domain/entities';
import { USER_ROLE, type UserRole } from '../../../core/domain/enums';
import { type UserModel } from '../../../generated/prisma/models/User';

const ROLE_MAP: Record<string, UserRole> = {
  ADMIN: USER_ROLE.ADMIN,
  BARBER: USER_ROLE.BARBER,
  COMPANY_ADMIN: USER_ROLE.COMPANY_ADMIN,
  CUSTOMER: USER_ROLE.CUSTOMER
};

export class UserMapper {
  static toDomain(raw: UserModel): User {
    return new User({
      barbershopId: raw.barbershopId,
      createdAt: raw.createdAt,
      email: raw.email,
      emailVerified: raw.emailVerified,
      id: raw.id,
      image: raw.image,
      name: raw.name,
      role: ROLE_MAP[raw.role] ?? USER_ROLE.CUSTOMER,
      updatedAt: raw.updatedAt
    });
  }
}
