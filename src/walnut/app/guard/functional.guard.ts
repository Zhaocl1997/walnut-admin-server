import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppConstCacheKeys, AppConstSettingKeysType } from '@/const/app/cache';
import { AppConstFunctionalMeta } from '@/const/decorator/functional';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { WalnutExceptionFunctionalityDisabled } from '@/exceptions/bussiness/app';

@Injectable()
export class FunctionalGuard implements CanActivate {
  private readonly logger = new Logger(FunctionalGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: AppCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const settingPayload =
      this.reflector.getAllAndOverride<AppConstSettingKeysType>(
        AppConstFunctionalMeta.SETTING,
        [context.getHandler(), context.getClass()],
      );

    const settingCache = await this.cacheService.get(
      AppConstCacheKeys.APP_SETTING,
    );

    if (!settingCache[settingPayload]) {
      this.logger.debug(`Cache missing..., key: ${settingPayload}`);
      return true;
    }

    if (+settingCache[settingPayload] !== 1) {
      throw new WalnutExceptionFunctionalityDisabled();
    }

    return true;
  }
}
