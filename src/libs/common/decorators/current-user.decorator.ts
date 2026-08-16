import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../../modules/users/persistence/users/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();
    return request.user;
  },
);
