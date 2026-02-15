import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { AuthModule } from './infrastructure/modules/auth/auth.module';
import { DatabaseModule } from './infrastructure/modules/database/database.module';
import { SwaggerModule } from './infrastructure/modules/swagger/swagger.module';
import { UserModule } from './infrastructure/modules/user/user.module';

@Module({
  controllers: [AppController],
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, SwaggerModule, AuthModule, UserModule],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
