import { type Barbershop } from '../../../core/domain/entities';

export class BarbershopPresenter {
  static toHttp(this: void, barbershop: Barbershop) {
    return {
      address: barbershop.address,
      createdAt: barbershop.createdAt.toISOString(),
      description: barbershop.description,
      id: barbershop.id,
      imageUrl: barbershop.imageUrl,
      logoUrl: barbershop.logoUrl,
      name: barbershop.name,
      phones: barbershop.phones,
      slug: barbershop.slug,
      stripeCustomerId: barbershop.stripeCustomerId,
      subscriptionStatus: barbershop.subscriptionStatus,
      themeColor: barbershop.themeColor,
      updatedAt: barbershop.updatedAt.toISOString()
    };
  }

  static toHttpList(this: void, barbershops: Barbershop[]) {
    return barbershops.map(barbershop => BarbershopPresenter.toHttp(barbershop));
  }
}
