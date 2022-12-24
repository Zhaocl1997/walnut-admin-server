import { AppConstAuthStrategy } from '@/const/app/strategy';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, WeiboUserInfo } from '../oauth-rewrite/weibo/strategy';
import { AuthOauthService } from '../../services/oauth.service';

@Injectable()
export class AuthOauthWeiboStrategy extends PassportStrategy(
  // @ts-expect-error
  Strategy,
  AppConstAuthStrategy.THIRD_PARTY_WEIBO,
) {
  private readonly logger = new Logger('Auth - Weibo');

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      passReqToCallback: true,

      clientID: configService.get<string>('auth.weibo.clientId'),
      clientSecret: configService.get<string>('auth.weibo.clientSecret'),
      callbackURL: configService.get<string>('auth.weibo.callbackURL'),
      scope: ['email'],
    });
  }

  async validate(
    request: IWalnutRequest,
    _accessToken: string,
    _refreshToken: string,
    profile: WeiboUserInfo,
  ) {
    this.logger.debug({ _accessToken });

    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(
      AuthOauthService,
      contextId,
    );

    const { id, name, email, avatar_url, provider } = profile;

    this.logger.debug({ provider, id, name });

    const user = await authService._validateUserOauth(
      name,
      provider,
      id,
      request.language,
      avatar_url,
      email,
    );

    return user;
  }
}
