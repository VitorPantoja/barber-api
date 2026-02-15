import { type User } from '../../../core/domain/entities';

export class UserPresenter {
  static toHttp(user: User) {
    return {
      barbershopId: user.barbershopId,
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      emailVerified: user.emailVerified,
      id: user.id,
      image: user.image,
      name: user.name,
      role: user.role,
      updatedAt: user.updatedAt.toISOString()
    };
  }

  static toHttpList(users: User[]) {
    return users.map(function (item) {
      return UserPresenter.toHttp(item);
    });
  }
}
