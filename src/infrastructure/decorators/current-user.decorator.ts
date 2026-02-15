import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { type User } from '../../core/domain/entities';

interface RequestWithUser {
  user: User;
}

function extractUser(_data: unknown, ctx: ExecutionContext): User {
  const request: RequestWithUser = ctx.switchToHttp().getRequest();
  return request.user;
}

export const CurrentUser = createParamDecorator(extractUser);
