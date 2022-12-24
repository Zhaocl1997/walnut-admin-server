import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { AuthService } from '../../auth.service';
import { AppConstAuthStrategy } from '@/const/app/strategy';

@Injectable()
export class LocalEmailStrategy extends PassportStrategy(
  Strategy,
  AppConstAuthStrategy.JWT_LOCAL_EMAIL,
) {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'emailAddress',
      passwordField: 'verifyCode',
    });
  }

  async validate(
    request: IWalnutRequest,
    emailAddress: string,
    verifyCode: string,
  ) {
    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService._validateUserEmail(
      emailAddress,
      verifyCode,
      request.language,
    );

    return user;
  }
}
