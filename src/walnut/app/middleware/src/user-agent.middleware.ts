import { AppConstHeaders } from '@/const/app/header';
import {
  WalnutExceptionUserAgentBrowserNotAcceptable,
  WalnutExceptionUserAgentNotAcceptable,
  WalnutExceptionUserAgentOSNotAcceptable,
} from '@/exceptions/middleware/user-agent';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const osList = this.configService.get<string[]>('middleware.userAgent.os');
    const browserList = this.configService.get<string[]>(
      'middleware.userAgent.browser',
    );

    const userAgent = req.headers[AppConstHeaders.USER_AGENT];

    if (!userAgent) {
      throw new WalnutExceptionUserAgentNotAcceptable();
    }

    const parsedUA = UAParser(userAgent);

    req.userAgent = parsedUA;

    req.os = parsedUA.os.name + ' ' + req.userAgent.os.version || parsedUA.ua;

    req.browser =
      parsedUA.browser.name + ' ' + req.userAgent.browser.version ||
      parsedUA.ua;

    if (!osList.some((i) => i.match(new RegExp(parsedUA.os.name)))) {
      throw new WalnutExceptionUserAgentOSNotAcceptable();
    }

    if (!browserList.some((i) => i.match(new RegExp(parsedUA.browser.name)))) {
      throw new WalnutExceptionUserAgentBrowserNotAcceptable();
    }

    next();
  }
}
