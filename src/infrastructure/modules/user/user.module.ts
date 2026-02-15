import { Module } from '@nestjs/common';

import { IUserService } from '../../../core/application/ports/user.service.port';
import { UserService } from '../../../core/application/services/user.service';
import { RolesGuard } from '../../guards/roles.guard';
import { SessionGuard } from '../../guards/session.guard';
import { UserController } from '../../http/controllers/user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [AuthModule],
  providers: [
    {
      provide: IUserService,
      useClass: UserService
    },
    SessionGuard,
    RolesGuard
  ]
})
export class UserModule {}
