import { AppConstCacheType } from '@/const/app/cache';
import { Injectable } from '@nestjs/common';
import { AppCacheService } from '../cache.service';

@Injectable()
export class AppCacheRolesService {
  constructor(private readonly cacheService: AppCacheService) {}

  private getRoleCacheKey(userId: string) {
    return `R_${userId}`;
  }

  // get role strings from cache
  async getRoles(userId: string) {
    return await this.cacheService.get<string[]>(this.getRoleCacheKey(userId));
  }

  // set role strings to cache
  async setRoles(user: IWalnutTokenPayload, roles: string[]) {
    // set roles into cache
    this.cacheService.set(this.getRoleCacheKey(user.userId), roles, {
      ttl: user.exp - user.iat,
      start: user.iat * 1000,
      t: AppConstCacheType.AUTH_ROLE_NAMES,
    });
  }
}
