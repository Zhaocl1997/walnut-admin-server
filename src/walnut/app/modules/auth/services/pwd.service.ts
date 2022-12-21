import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppPermissionService } from '@/modules/shared/permission/permission.service';
import { AppTokenService } from '@/modules/shared/token/token.service';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { SysUserService } from '@/modules/business/system/user/user.service';
import { AppTokenEntity } from '../entities/auth.entity';
import { AppConstCacheType } from '@/const/app/cache';

@Injectable()
export class AuthPwdService {
  constructor(
    private readonly userService: SysUserService,
    private readonly configService: ConfigService,
    private readonly cacheService: AppCacheService,
    private readonly tokenService: AppTokenService,
    private readonly permissionService: AppPermissionService,
  ) {}

  /**
   * @description generate auth tokens, return accessToken and refreshToken
   */
  async generateAuthTokens(payload: IWalnutTokenPayload) {
    // get access token and refresh token
    const accessToken = await this.tokenService.getJwtAccessToken(payload);
    const refreshToken = await this.tokenService.getJwtRefreshToken(payload);

    // save refresh token to database
    await this.userService.setRefreshToken(refreshToken, payload.userId);

    // get current user permission string arry
    const permissions = await this.permissionService.getPermissionStrings(
      payload.roleIds,
    );

    // default make the cache as long as the access token expire
    const CACHE_TTL = parseInt(
      this.configService.get<string>('jwt.access.expire'),
    );

    // set permissions into cache
    this.cacheService.set(`P_${payload.userId}`, permissions, {
      ttl: CACHE_TTL,
      t: AppConstCacheType.AUTH_PERMISSIONS,
    });
    // set roleNames into cache
    this.cacheService.set(`R_${payload.userId}`, payload.roleNames, {
      ttl: CACHE_TTL,
      t: AppConstCacheType.AUTH_ROLE_NAMES,
    });

    return new AppTokenEntity({ accessToken, refreshToken });
  }

  /**
   * @description sign out
   */
  async signout(payload: IWalnutTokenPayload) {
    //  remove permissions from cache
    this.cacheService.del(`P_${payload.userId}`);
    //  remove roleNames from cache
    this.cacheService.del(`R_${payload.userId}`);

    return await this.userService.removeRefreshToken(payload.userId);
  }
}
