import { AppConstAuthStrategy } from '@/const/app/strategy';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WalnutExceptionRefreshTokenExpired } from '../../../../exceptions/bussiness/auth';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(
  AppConstAuthStrategy.JWT_REFRESH_TOKEN,
) {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new WalnutExceptionRefreshTokenExpired();
    }
    return user;
  }
}
