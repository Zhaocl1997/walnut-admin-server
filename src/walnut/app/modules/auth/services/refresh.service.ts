import { Injectable } from '@nestjs/common';
import { AppTokenService } from '@/modules/shared/token/token.service';

@Injectable()
export class AuthRefreshService {
  constructor(private readonly tokenService: AppTokenService) {}

  /**
   * @description get access token
   */
  async refreshAccessToken(payload: IWalnutTokenPayload) {
    return await this.tokenService.getJwtAccessToken(payload);
  }
}
