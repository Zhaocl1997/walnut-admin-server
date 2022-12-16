import { AppConstCacheTypeType } from '@/const/app/cache';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, StoreConfig } from 'cache-manager';

interface MyCacheContent<T = any> {
  v: T;
  /**
   * @description ttl, seconds
   */
  ttl: number;
  /**
   * @description start time timestamp
   */
  start: number;
  /**
   * @description cache type
   */
  t: AppConstCacheTypeType;
}

interface MyCacheOptions extends StoreConfig {
  /**
   * @description start time timestamp
   */
  start?: number;
  /**
   * @description cache type
   */
  t: AppConstCacheTypeType;
}

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly cachePrefix = 'WALNUT_CACHE';

  private getCacheKey(key: string) {
    return key.startsWith(this.cachePrefix)
      ? key
      : `${this.cachePrefix}_${key}`;
  }

  // custom set
  public async set<T = any>(key: string, value: T, options: MyCacheOptions) {
    const cacheKey = this.getCacheKey(key);

    const val: MyCacheContent = {
      v: value,
      ttl: (options?.ttl as number) ?? 0,
      start: options?.start ?? Date.now(),
      t: options.t,
    };

    return await this.cacheManager.set(cacheKey, val, val.ttl);
  }

  // custom get
  public async get<T = any>(key: string, needExpire = false): Promise<T> {
    const cacheKey = this.getCacheKey(key);

    try {
      if (needExpire) {
        return await this.cacheManager.get(cacheKey);
      } else {
        const cache = await this.cacheManager.get<MyCacheContent>(cacheKey);
        return cache.v;
      }
    } catch {
      return null;
    }
  }

  // delete
  public async del(key: string) {
    const cacheKey = this.getCacheKey(key);

    return await this.cacheManager.del(cacheKey);
  }

  // only delete auth caches
  // used for menu change
  public async delAllAuthCache() {
    const keys = await this.cacheManager.store.keys();

    for (const key of keys) {
      if (
        key.startsWith(this.getCacheKey('P')) ||
        key.startsWith(this.getCacheKey('R'))
      ) {
        await this.del(key);
      }
    }
  }

  // clear
  public async clear() {
    // do not clear built-in cache
    const allData = await this.list();

    await Promise.all(
      Object.entries(allData).map(
        ([k, v]) => v.t !== 'built-in' && this.del(k),
      ),
    );

    return true;
  }

  // list
  public async list() {
    const keys = await this.cacheManager.store.keys();

    // Loop through keys and get data
    const allData: { [key: string]: MyCacheContent } = {};

    for (const key of keys) {
      // TODO do not need bull cache
      if (!key.includes('bull')) {
        allData[key] = await this.cacheManager.get(key);
      }
    }

    return allData;
  }
}
