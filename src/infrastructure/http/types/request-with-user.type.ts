import { type Request } from 'express';

import { type User } from '../../../core/domain/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
