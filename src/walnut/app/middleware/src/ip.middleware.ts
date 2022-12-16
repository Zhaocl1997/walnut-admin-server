import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as requestIp from '@supercharge/request-ip';
import { ConfigService } from '@nestjs/config';
import { WalnutExceptionIPNotAcceptable } from '@/exceptions/middleware/ip';
import { AppConstHeaders } from '@/const/app/header';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const ip = requestIp.getClientIp(req);

    const ipBlackList = this.configService.get<string[]>(
      'middleware.ip.blackList',
    );

    req.headers[AppConstHeaders.IP] = ip;
    req.realIp = ip;

    if (ipBlackList.includes(ip)) {
      throw new WalnutExceptionIPNotAcceptable();
    }

    next();
  }
}
