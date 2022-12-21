import { Injectable, Logger } from '@nestjs/common';

import { AppSettingRepository } from './setting.repository';
import { AppSettingDto } from './dto/setting.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppConstCacheKeys, AppConstCacheType, AppConstSettingKeys } from '@/const/app/cache';

@Injectable()
export class AppSettingService {
  private readonly logger = new Logger(AppSettingService.name);

  constructor(
    private readonly settingRepo: AppSettingRepository,
    private readonly cacheService: AppCacheService,
  ) {}

  // base CRUD
  async create(dto: AppSettingDto, user: IWalnutTokenPayload) {
    const created = await this.settingRepo.create({
      ...dto,
      createdBy: user.userId,
    });

    // re-extract app setting after create
    await this.extractAppSettingIntoCache();

    return created;
  }

  async read(id: string) {
    return await this.settingRepo.readById(id);
  }

  async update(dto: AppSettingDto) {
    const updated = await this.settingRepo.update(dto);

    // re-extract app setting after update
    await this.extractAppSettingIntoCache();

    return updated;
  }

  async findAll(params?: WalnutListRequestDTO<AppSettingDto>) {
    return await this.settingRepo.list(params);
  }

  // extract all app setting into cache
  async extractAppSettingIntoCache() {
    const allAppSettings = await this.findAll();

    const dataToCache = Object.fromEntries(
      allAppSettings.data.map((i) => [i.settingKey, i.settingValue]),
    );

    this.logger.debug('Extracting App Settings...');

    await this.cacheService.set(AppConstCacheKeys.APP_SETTING, dataToCache, {
      t: AppConstCacheType.BUILT_IN,
    });
  }

  // get auth form settings
  async getAuthSettings() {
    const res = await this.cacheService.get(AppConstCacheKeys.APP_SETTING);

    return {
      account: +res[AppConstSettingKeys.APP_AUTH_ACCOUNT],
      email: +res[AppConstSettingKeys.APP_AUTH_EMAIL],
      phone: +res[AppConstSettingKeys.APP_AUTH_PHONE],
      qrcode: +res[AppConstSettingKeys.APP_AUTH_QR],
      gitee: +res[AppConstSettingKeys.APP_AUTH_GITEE],
      github: +res[AppConstSettingKeys.APP_AUTH_GITHUB],
      weibo: +res[AppConstSettingKeys.APP_AUTH_WEIBO],
    };
  }
}
