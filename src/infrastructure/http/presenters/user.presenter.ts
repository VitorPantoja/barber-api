import { type User } from '../../../core/domain/entities';

export class UserPresenter {
  static toHttp(this: void, user: User) {
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

  static toHttpList(this: void, users: User[]) {
    return users.map(user => UserPresenter.toHttp(user));
  }
}
