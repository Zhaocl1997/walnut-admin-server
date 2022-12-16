import { AppConstHeaders } from '@/const/app/header';
import { AppDayjs } from '@/utils/dayjs';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TimestampMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const reqTS = AppDayjs.tz(new Date(), req.timezone).valueOf();

    req.headers[AppConstHeaders.TIMESTAMP] = reqTS + '';
    req.timestamp = reqTS;

    next();
  }
}
