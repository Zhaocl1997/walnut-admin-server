import { Injectable } from '@nestjs/common';

import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppMailerService } from '@/modules/shared/mailer/mailer.service';
import { UtilServiceVeriyCode } from '@/modules/shared/utils/verifyCode';

import { AppConstCacheKeys, AppConstCacheType, AppConstSettingKeys } from '@/const/app/cache';

import { SendAuthEmailDTO } from '../dto/auth.dto';
import { AuthPwdService } from './pwd.service';

@Injectable()
export class AuthEmailService {
  constructor(
    private readonly cacheService: AppCacheService,
    private readonly mailerService: AppMailerService,
    private readonly authPwdService: AuthPwdService,
    private readonly verifyCodeService: UtilServiceVeriyCode,
  ) {}

  // send verify code email, use phoneNumber as key and set to cache
  async sendAuthEmail(payload: SendAuthEmailDTO, language: string) {
    const cacheAppSetting = await this.cacheService.get(
      AppConstCacheKeys.APP_SETTING,
    );

    // get setting from cache
    const codeFigure =
      +cacheAppSetting[AppConstSettingKeys.VERIFY_EMIAL_FIGURE];
    const codeTTL = +cacheAppSetting[AppConstSettingKeys.VERIFY_EMIAL_TTL];

    // get verify code
    // default 6 figures
    const code = this.verifyCodeService.generateVerifyCode(codeFigure);

    const cacheKey = payload.emailAddress;

    // send the verify email
    await this.mailerService.sendVerifyCodeEmail(
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

  // email auth
  async generateAuthTokens(payload: IWalnutTokenPayload) {
    return await this.authPwdService.generateAuthTokens(payload);
  }
}
