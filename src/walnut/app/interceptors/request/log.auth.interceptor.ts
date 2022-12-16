import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { I18nContext } from 'nestjs-i18n';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SysLogAuthService } from '../../modules/business/system/logs/auth/log.auth.service';
import { getLocationThroughIP } from '../../utils/vendor/baidu';

import {
  AppConstAuthMeta,
  AppConstLogAuthTypeType,
} from '@/const/decorator/logAuth';

@Injectable()
export class LogAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logAuthService: SysLogAuthService,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IWalnutRequest>();
    const response = ctx.getResponse<IWalnutResponse>();

    const payloadAuthType =
      this.reflector.getAllAndOverride<AppConstLogAuthTypeType>(
        AppConstAuthMeta.TYPE,
        [context.getHandler(), context.getClass()],
      );

    const baiduAK = this.configService.get('vendor.baidu');

    const insert = async (msg: string, success: boolean) => {
      const location = await getLocationThroughIP({
        ak: baiduAK,
        ip: request.realIp,
      });

      const i18n = I18nContext.current();
      const translatedMsg = await i18n.t(msg);

      await this.logAuthService.create({
        ip: request.realIp,
        location: location ?? request.location,

        os: request.os,
        browser: request.browser,

        userId: request.user.userId,
        userName: request.user.userName,

        success,
        msg: translatedMsg,

        type: payloadAuthType,
      });
    };

    return next.handle().pipe(
      tap({
        next: async () => {
          await insert('response.2000', true);
        },
        error: async (e) => {
          const errCode = e.getResponse().errCode;

          await insert(`response.${errCode}`, false);
        },
      }),
    );
  }
}
