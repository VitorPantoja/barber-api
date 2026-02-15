import { Module } from '@nestjs/common';

import { IUserService } from '../../../core/application/ports/user.service.port';
import { UserService } from '../../../core/application/services/user.service';
import { IUserRepository } from '../../../core/domain/repositories';
import { UserRepository } from '../../database/repositories/user.repository';
import { RolesGuard } from '../../guards/roles.guard';
import { SessionGuard } from '../../guards/session.guard';
import { UserController } from '../../http/controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    {
      provide: IUserService,
      useClass: UserService
    },
    SessionGuard,
    RolesGuard
  ]
})
export class UserModule {}
