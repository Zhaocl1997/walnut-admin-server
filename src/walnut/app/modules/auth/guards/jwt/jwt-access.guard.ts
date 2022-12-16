import { AppConstAuthStrategy } from '@/const/app/strategy';
import { AppConstPublicMeta } from '@/const/decorator/public';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { WalnutExceptionAccessTokenExpired } from '../../../../exceptions/bussiness/auth';

@Injectable()
export class JwtAccessGuard extends AuthGuard(
  AppConstAuthStrategy.JWT_ACCESS_TOKEN,
) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Used for public api which do not need auth
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AppConstPublicMeta.PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new WalnutExceptionAccessTokenExpired();
    }
    return user;
  }
}
