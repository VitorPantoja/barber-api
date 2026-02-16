import { Module } from '@nestjs/common';

import { IBarbershopService, ICatalogService } from 'src/core/application/ports';

import { BarbershopService } from '../../../core/application/services/barbershop.service';
import { CatalogService } from '../../../core/application/services/catalog.service';
import { BarbershopController } from '../../http/controllers/barbershop.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [BarbershopController],
  exports: [IBarbershopService, ICatalogService],
  imports: [AuthModule, DatabaseModule],
  providers: [
    {
      provide: IBarbershopService,
      useClass: BarbershopService
    },
    {
      provide: ICatalogService,
      useClass: CatalogService
    }
  ]
})
export class BarbershopModule {}
