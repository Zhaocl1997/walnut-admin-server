import { AppConstAuthStrategy } from '@/const/app/strategy';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, GiteeUserInfo } from '../oauth-rewrite/gitee/strategy';
import { AuthOauthService } from '../../services/oauth.service';

@Injectable()
export class AuthOauthGiteeStrategy extends PassportStrategy(
  // @ts-expect-error
  Strategy,
  AppConstAuthStrategy.THIRD_PARTY_GITEE,
) {
  private readonly logger = new Logger('Auth - Gitee');

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      passReqToCallback: true,

      clientID: configService.get<string>('auth.gitee.clientId'),
      clientSecret: configService.get<string>('auth.gitee.clientSecret'),
      callbackURL: configService.get<string>('auth.gitee.callbackURL'),
      scope: ['user_info'],
    });
  }

  async validate(
    request: IWalnutRequest,
    _accessToken: string,
    _refreshToken: string,
    profile: GiteeUserInfo,
  ) {
    this.logger.debug({ _accessToken });

    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(
      AuthOauthService,
      contextId,
    );

    const { id, name, email, avatar_url, provider } = profile;

    this.logger.debug({ id, name, email, avatar_url, provider });

    const user = await authService.validateOauthUser(
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
