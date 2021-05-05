import { createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../../users/user.model';

export type TReturnedUserType =
  | UserDocument


export const GetUser = createParamDecorator(
  (_, ctx): TReturnedUserType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
