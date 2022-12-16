import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SysUserService } from '../../../business/system/user/user.service';
import { AppConstAuthStrategy } from '@/const/app/strategy';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AppConstAuthStrategy.JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: SysUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: IWalnutRequest) => {
          return request?.body.refreshToken;
        },
      ]),
      secretOrKey: configService.get<string>('jwt.refresh.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: IWalnutRequest,
    payload: IWalnutTokenPayload,
  ): Promise<IWalnutTokenPayload> {
    const refreshToken = request?.body.refreshToken;

    // just check refresh token
    await this.userService.getIfRefreshTokenMatched(
      refreshToken,
      payload.userId,
    );

    return {
      userId: payload.userId,
      userName: payload.userName,
      roleIds: payload.roleIds,
      roleNames: payload.roleNames,
      emailAddress: payload.emailAddress,
      phoneNumber: payload.phoneNumber,

      key: payload.key,
    };
  }
}
