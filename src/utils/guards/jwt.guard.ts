import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TUserDocument, UserRoles } from 'src/schemas/user.model';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  allowRoles: UserRoles[];
  constructor(allowRoles: UserRoles[] = []) {
    super();
    this.allowRoles = [UserRoles.admin, ...allowRoles];
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) throw new UnauthorizedException();

    const hasAccess = this.checkAccess(user);
    if (!hasAccess) throw new UnauthorizedException();

    return user;
  }

  private checkAccess(user: TUserDocument): boolean {
    return this.allowRoles.reduce((acc, el) => {
      if (acc) return acc;
      return user.role.includes(el as never);
    }, false);
  }
}
