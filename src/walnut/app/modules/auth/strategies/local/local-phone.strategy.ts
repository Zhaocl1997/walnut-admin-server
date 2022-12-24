import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { AuthService } from '../../auth.service';
import { AppConstAuthStrategy } from '@/const/app/strategy';

@Injectable()
export class LocalPhoneStrategy extends PassportStrategy(
  Strategy,
  AppConstAuthStrategy.JWT_LOCAL_PHONE,
) {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'phoneNumber',
      passwordField: 'verifyCode',
    });
  }

  async validate(
    request: IWalnutRequest,
    phoneNumber: string,
    verifyCode: string,
  ) {
    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService._validateUserPhone(phoneNumber, verifyCode);

    return user;
  }
}
