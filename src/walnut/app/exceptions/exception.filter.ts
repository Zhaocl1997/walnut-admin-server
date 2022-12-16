import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { WalnutResponseExceptioneHandler } from '../utils/exception';
import { setCustomHeaders } from '@/interceptors/response/success.interceptor';

// translate response message
// some code need res.msg as args
export const translateResponseMessage = async (
  res: IWalnutResponseBase,
  i18n: I18nContext,
) => {
  if (res.code === 4020) {
    return await i18n.t(`response.4020`, {
      args: { fields: res.msg },
    });
  } else {
    return await i18n.t(res.msg);
  }
};

@Catch()
export class WalnutExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<IWalnutResponse>();
    const request = ctx.getRequest<IWalnutRequest>();

    const i18n = I18nContext.current();

    const walnutErrorResponse = WalnutResponseExceptioneHandler(exception);

    // @ts-ignore
    // TODO
    // extract error module
    setCustomHeaders(ctx);

    const errMsg = await translateResponseMessage(walnutErrorResponse, i18n);

    response
      .status(HttpStatus.OK)
      .json(Object.assign(walnutErrorResponse, { msg: errMsg }));
  }
}
