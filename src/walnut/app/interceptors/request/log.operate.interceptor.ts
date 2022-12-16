import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SysLogOperateService } from '../../modules/business/system/logs/operate/log.service';
import { getLocationThroughIP } from '../../utils/vendor/baidu';
import { WalnutResponseSuccess } from '../../utils/response';
import { WalnutResponseExceptioneHandler } from '../../utils/exception';
import { I18nContext } from 'nestjs-i18n';
import {
  AppConstLogOperateActionType,
  AppConstLogOperateMeta,
} from '../../const/decorator/logOperate';
import { translateResponseMessage } from '@/exceptions/exception.filter';

@Injectable()
export class LogOperateInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private SysLogOperateService: SysLogOperateService,
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const title = this.reflector.get<string>(
      AppConstLogOperateMeta.LOG_TITLE,
      context.getHandler(),
    );

    const action = this.reflector.get<AppConstLogOperateActionType>(
      AppConstLogOperateMeta.LOG_ACTION,
      context.getHandler(),
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IWalnutRequest>();
    const response = ctx.getResponse<IWalnutResponse>();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    const baiduAK = this.configService.get('vendor.baidu');

    const insertToLogOperate = async (
      resData: IWalnutResponseBase,
      success: boolean,
    ) => {
      const correspondingMS = Date.now() - now;

      const location = await getLocationThroughIP({
        ak: baiduAK,
        ip: request.realIp,
      });

      const i18n = I18nContext.current();
      const translatedMsg = await translateResponseMessage(resData, i18n);

      await this.SysLogOperateService.create({
        title,
        actionType: action,
        method: request.method,
        url: request.url,
        httpVersion: request.httpVersion,

        statusCode: response.statusCode,

        requestData: JSON.stringify(request.body || request.params),
        responseData: JSON.stringify(
          Object.assign(resData, { msg: translatedMsg }),
        ),
        correspondingMS,

        os: request.os,
        browser: request.browser,

        ip: request.realIp,
        location: location ?? request.location,

        userId: request.user.userId,
        userName: request.user.userName,

        invokingMethod: `${className}.${handlerName}`,
        success,
      });
    };

    return next.handle().pipe(
      tap({
        next: async (res) => {
          // TODO should not achieve in this way
          await insertToLogOperate(WalnutResponseSuccess(res), true);
        },
        error: async (e) => {
          await insertToLogOperate(WalnutResponseExceptioneHandler(e), false);
        },
      }),
    );
  }
}
