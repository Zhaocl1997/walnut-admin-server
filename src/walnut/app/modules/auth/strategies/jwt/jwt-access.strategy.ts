import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConstAuthStrategy } from '@/const/app/strategy';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  AppConstAuthStrategy.JWT_ACCESS_TOKEN,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.access.secret'),
    });
  }

  async validate(payload: IWalnutTokenPayload): Promise<IWalnutTokenPayload> {
    return {
      userId: payload.userId,
      userName: payload.userName,
      roleIds: payload.roleIds,
      roleNames: payload.roleNames,
      emailAddress: payload.emailAddress,
      phoneNumber: payload.phoneNumber,

      key: payload.key,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
