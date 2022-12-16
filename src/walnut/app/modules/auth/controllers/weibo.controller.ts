import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Render,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { interval, map, switchMap } from 'rxjs';

import { AuthPwdService } from '../services/pwd.service';
import { AuthFingerprintService } from '../services/fingerprint.service';
import { WalnutExceptionOauthFailed } from '@/exceptions/bussiness/auth';
import { OauthWeiboGuard } from '../guards/oauth/weibo.guard';
import { LogAuth } from '@/decorators/walnut/log.auth.decorator';
import { AppConstLogAuthType } from '@/const/decorator/logAuth';
import { WalnutUser } from '@/decorators/user.decorator';
import { FunctionalCheck } from '@/decorators/walnut/functional.decorator';
import { AppConstSettingKeys } from '@/const/app/cache';

@ApiTags('auth/third/weibo')
@Controller('auth/third/weibo')
@FunctionalCheck(AppConstSettingKeys.APP_AUTH_WEIBO)
export class AuthThirdPartyWeiboController {
  private readonly logger = new Logger(AuthThirdPartyWeiboController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly fingerPrintService: AuthFingerprintService,
    private readonly authPwdService: AuthPwdService,
  ) {}

  private readonly oauthUrl = 'https://api.weibo.com/oauth2/authorize';

  get clientId() {
    return this.configService.get<string>('auth.weibo.clientId');
  }

  get callbackURL() {
    return this.configService.get<string>('auth.weibo.callbackURL');
  }

  private getOAuthURL(fp: string) {
    return `${this.oauthUrl}?client_id=${this.clientId}&redirect_uri=${this.callbackURL}&response_type=code&scope=email&state=${fp}`;
  }

  @Get('/oauth')
  async OAuth(@Req() req: IWalnutRequest) {
    return this.getOAuthURL(req.fingerprint);
  }

  @Sse('/check/:fpId')
  async checkState(@Param('fpId') fpId: string) {
    return interval(1000).pipe(
      switchMap(async () => {
        const res = await this.fingerPrintService.getFPInfo<FingerPrintInfo>(
          fpId,
        );

        if (res.auth.weibo) {
          return res.tokens;
        }

        return false;
      }),
      map((res) => res),
    );
  }

  @Get('/callback')
  @Render('third')
  @LogAuth(AppConstLogAuthType.OTHER_WEIBO)
  @UseGuards(OauthWeiboGuard)
  async callback(
    @WalnutUser() user: IWalnutTokenPayload,
    @Query('state') state: string,
  ) {
    try {
      this.logger.debug(user);

      const tokens = await this.authPwdService.generateAuthTokens(user);

      // set new fp info
      await this.fingerPrintService.setFPID(state, {
        auth: { weibo: true },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new WalnutExceptionOauthFailed();
    }
  }
}
