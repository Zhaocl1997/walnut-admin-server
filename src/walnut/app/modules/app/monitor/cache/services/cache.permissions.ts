import { AppConstCacheType } from '@/const/app/cache';
import { Injectable } from '@nestjs/common';
import { AppCacheService } from '../cache.service';

@Injectable()
export class AppCachePermissionsService {
  constructor(private readonly cacheService: AppCacheService) {}

  private getPermissionCacheKey(userId: string) {
    return `P_${userId}`;
  }

  // get permission strings from cache
  async getPermissions(userId: string) {
    return await this.cacheService.get<string[]>(
      this.getPermissionCacheKey(userId),
    );
  }

  // set permission strings to cache
  async setPermissions(user: IWalnutTokenPayload, permissions: string[]) {
    // set permissions into cache
    this.cacheService.set(
      this.getPermissionCacheKey(user.userId),
      permissions,
      {
        ttl: user.exp - user.iat,
        start: user.iat * 1000,
        t: AppConstCacheType.AUTH_PERMISSIONS,
      },
    );
  }
}
