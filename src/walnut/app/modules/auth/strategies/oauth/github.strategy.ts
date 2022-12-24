import { AppConstAuthStrategy } from '@/const/app/strategy';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, GitHubUserInfo } from '../oauth-rewrite/github/strategy';
import { AuthOauthService } from '../../services/oauth.service';

@Injectable()
export class AuthOauthGitHubStrategy extends PassportStrategy(
  // @ts-expect-error
  Strategy,
  AppConstAuthStrategy.THIRD_PARTY_GITHUB,
) {
  private readonly logger = new Logger('Auth - GitHub');

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      passReqToCallback: true,

      clientID: configService.get<string>('auth.github.clientId'),
      clientSecret: configService.get<string>('auth.github.clientSecret'),
      callbackURL: configService.get<string>('auth.github.callbackURL'),
      scope: ['public_profile'],
    });
  }

  async validate(
    request: IWalnutRequest,
    _accessToken: string,
    _refreshToken: string,
    profile: GitHubUserInfo,
  ) {
    this.logger.debug({ _accessToken });

    const contextId = ContextIdFactory.getByRequest(request);

    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(
      AuthOauthService,
      contextId,
    );

    const { id, username, email, avatar_url, provider } = profile;

    this.logger.debug({ id, username, email, avatar_url, provider });

    const user = await authService._validateUserOauth(
      username,
      provider,
      id,
      request.language,
      avatar_url,
      email,
    );

    return user;
  }
}
