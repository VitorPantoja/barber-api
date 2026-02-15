import { User } from '../../../core/domain/entities';
import { UserRole } from '../../../generated/prisma/enums';
import { type UserModel } from '../../../generated/prisma/models/User';

const ROLE_MAP: Record<string, UserRole> = {
  ADMIN: UserRole.ADMIN,
  BARBER: UserRole.BARBER,
  COMPANY_ADMIN: UserRole.COMPANY_ADMIN,
  CUSTOMER: UserRole.CUSTOMER
};

export class PrismaUserMapper {
  static toDomain(raw: UserModel): User {
    return new User({
      barbershopId: raw.barbershopId,
      createdAt: raw.createdAt,
      email: raw.email,
      emailVerified: raw.emailVerified,
      id: raw.id,
      image: raw.image,
      name: raw.name,
      role: ROLE_MAP[raw.role] ?? UserRole.CUSTOMER,
      updatedAt: raw.updatedAt
    });
  }
}
