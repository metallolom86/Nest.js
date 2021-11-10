import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUserDocument } from '../../schemas/user.model';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): TUserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
