import { AppConstCacheKeys, AppConstSettingKeys } from '@/const/app/cache';
import { Injectable } from '@nestjs/common';
import { AppCacheService } from './cache.service';

// TODO central control the cache
// do not use cacheService here or there
@Injectable()
export class AppCacheCustomService {
  constructor(private readonly cacheService: AppCacheService) {}

  async getAppSettings() {
    return await this.cacheService.get(AppConstCacheKeys.APP_SETTING);
  }

  async getDefaultPassword() {
    const appSetting = await this.getAppSettings();

    return appSetting[AppConstSettingKeys.DEFAULT_PASSWORD];
  }

  async getDefaultRole() {
    const appSetting = await this.getAppSettings();

    return appSetting[AppConstSettingKeys.DEFAULT_ROLE];
  }
}
