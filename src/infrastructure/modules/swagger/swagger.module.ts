import { type INestApplication, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule as NestSwaggerModule } from '@nestjs/swagger';

@Module({})
export class SwaggerModule {
  static setup(app: INestApplication, configService: ConfigService): void {
    const config = new DocumentBuilder()
      .setTitle(configService.get('API_TITLE', 'Barber API'))
      .setDescription('Multi-tenant barbershop SaaS marketplace API')
      .setVersion(configService.get('API_VERSION', '1.0.0'))
      .addBearerAuth()
      .addTag('Auth', 'Authentication & session management')
      .addTag('Barbershops', 'Tenant CRUD & management')
      .addTag('Catalog', 'Barbershop services & marketplace search')
      .addTag('Health', 'Health check endpoints')
      .addTag('Scheduling', 'Bookings & availability')
      .build();

    const document = NestSwaggerModule.createDocument(app, config);
    NestSwaggerModule.setup('docs', app, document);
  }
}
