import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction): void {
    const { method, baseUrl } = req;

    const log = () => {
      const { statusCode } = res;

      const resTime = res.getHeader('X-Response-Time');

      this.logger.log(
        `${method} ${baseUrl} ${statusCode} - ${
          req.userAgent.os.name ?? req.userAgent.ua
        } - ${req.userAgent.browser.name ?? req.userAgent.ua} - ${
          req.realIp
        } - ${req.id} - ${resTime}`,
      );
    };

    res.on('finish', log);
    res.on('error', log);

    next();
  }
}
