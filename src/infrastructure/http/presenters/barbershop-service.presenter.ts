import { type BarbershopService } from '../../../core/domain/entities';

export class BarbershopServicePresenter {
  static toHttp(this: void, service: BarbershopService) {
    return {
      barbershopId: service.barbershopId,
      createdAt: service.createdAt.toISOString(),
      description: service.description,
      durationMinutes: service.durationMinutes,
      id: service.id,
      imageUrl: service.imageUrl,
      name: service.name,
      price: service.priceInReais(),
      priceInCents: service.priceInCents,
      updatedAt: service.updatedAt.toISOString()
    };
  }

  static toHttpList(this: void, services: BarbershopService[]) {
    return services.map(service => BarbershopServicePresenter.toHttp(service));
  }
}
