import { Injectable } from '@nestjs/common';

import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppSmsService } from '@/modules/shared/sms/sms.service';
import { UtilServiceVeriyCode } from '@/modules/shared/utils/verifyCode';

import { AppConstCacheKeys, AppConstCacheType, AppConstSettingKeys } from '@/const/app/cache';

import { SendAuthTextMessageDTO } from '../dto/auth.dto';
import { AuthPwdService } from './pwd.service';

@Injectable()
export class AuthPhoneService {
  constructor(
    private readonly cacheService: AppCacheService,
    private readonly phoneService: AppSmsService,
    private readonly authPwdService: AuthPwdService,
    private readonly verifyCodeService: UtilServiceVeriyCode,
  ) {}

  // send verify code text message, use phoneNumber as key and set to cache
  async sendAuthTextMessage(payload: SendAuthTextMessageDTO, language: string) {
    const cacheAppSetting = await this.cacheService.get(
      AppConstCacheKeys.APP_SETTING,
    );

    // get setting from cache
    const codeFigure =
      +cacheAppSetting[AppConstSettingKeys.VERIFY_PHONE_FIGURE];
    const codeTTL = +cacheAppSetting[AppConstSettingKeys.VERIFY_PHONE_TTL];

    // get verify code
    // default 6 figures
    const code = this.verifyCodeService.generateVerifyCode(codeFigure);

    const cacheKey = payload.phoneNumber;

    // send the verify text message
    await this.phoneService.sendVerifyCodeTextMessage(
      cacheKey,
      code,
      codeTTL,
      language,
    );

    // default 300s
    await this.cacheService.set(cacheKey, code, {
      ttl: codeTTL,
      t: AppConstCacheType.VERIFY_CODE,
    });

    return true;
  }

  // phone auth
  async generateAuthTokens(payload: IWalnutTokenPayload) {
    return await this.authPwdService.generateAuthTokens(payload);
  }
}
