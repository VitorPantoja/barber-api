import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/modules/auth/auth.module';
import { DatabaseModule } from './infrastructure/modules/database/database.module';
import { SwaggerModule } from './infrastructure/modules/swagger/swagger.module';
import { UserModule } from './infrastructure/modules/user/user.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseModule, SwaggerModule, AuthModule, UserModule],
  providers: [AppService]
})
export class AppModule {}
