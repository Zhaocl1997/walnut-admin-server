import { AppConstHeaders } from '@/const/app/header';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  WalnutResponseException,
  WalnutResponseSuccess,
} from '../../utils/response';

export const setCustomHeaders = (context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const response = ctx.getResponse<IWalnutResponse>();
  const request = ctx.getRequest<IWalnutRequest>();

  response.setHeader(AppConstHeaders.ID, request.id);
  response.setHeader(AppConstHeaders.IP, request.realIp);
  // response-time has auto add to haeders
  response.setHeader(AppConstHeaders.TIMEZONE, request.timezone);
  response.setHeader(AppConstHeaders.TIMESTAMP, request.timestamp);
  response.setHeader(AppConstHeaders.LANGUAGE, request.language);
  response.setHeader(AppConstHeaders.VERSION, request.version);
  response.setHeader(AppConstHeaders.REPO_VERSION, request.repoVersion);
};

@Injectable()
export class WalnutSuccessResponseInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<IWalnutResponseBase>> {
    if (context.getType() === 'http') {
      const i18n = I18nContext.current()

      const successMsg = await i18n.t('response.2000');

      setCustomHeaders(context);

      return next.handle().pipe(
        map((data) => {
          // handle test error endpoints
          if (data?.response?.errType) {
            const errCode = data.response.errCode;
            const errMsg = data.response?.errMsg;

            data = WalnutResponseException({ errCode });

            // if errMsg exists, try to translate it first
            // if do not find errMsg in i18n messages, it'll return the original errMsg
            // so simply modify your errMsg when do not need translate
            data.msg = i18n.t(errMsg ?? `response.${errCode}`);
          }

          // mongoose validation error
          if (data?._message) {
            data = WalnutResponseException({ errCode: 5555 });
            data.msg = i18n.t(`response.${5555}`);
          }

          return WalnutResponseSuccess(data, successMsg);
        }),
      );
    }

    return next.handle();
  }
}
