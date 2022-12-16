import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { AuthService } from '../../auth.service';
import { AppConstAuthStrategy } from '@/const/app/strategy';

@Injectable()
export class LocalPasswordStrategy extends PassportStrategy(
  Strategy,
  AppConstAuthStrategy.JWT_LOCAL_PASSWORD,
) {
  constructor(private readonly moduleRef: ModuleRef) {
    super({ passReqToCallback: true, usernameField: 'userName' });
  }

  async validate(request: IWalnutRequest, userName: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService.validateUserPassword(userName, password);

    return user;
  }
}
