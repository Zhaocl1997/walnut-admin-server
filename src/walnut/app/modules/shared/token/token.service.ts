import { AppConstTokenKey } from '@/const/app/token';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description get access token
   */
  async getJwtAccessToken(payload: IWalnutTokenPayload) {
    return await this.jwtService.signAsync(
      Object.assign(payload, { key: AppConstTokenKey.ACCESS }),
      {
        secret: this.configService.get<string>('jwt.access.secret'),
        expiresIn: `${this.configService.get<string>('jwt.access.expire')}s`,
      },
    );
  }

  /**
   * @description get refresh token
   */
  async getJwtRefreshToken(payload: IWalnutTokenPayload) {
    return await this.jwtService.signAsync(
      Object.assign(payload, { key: AppConstTokenKey.REFRESH }),
      {
        secret: this.configService.get<string>('jwt.refresh.secret'),
        expiresIn: `${this.configService.get<string>('jwt.refresh.expire')}s`,
      },
    );
  }
}
