import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { AppConstHeaders } from '@/const/app/header';
import { AppDayjs } from '@/utils/dayjs';

@Injectable()
export class TimezoneMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const reqTZ = AppDayjs.tz.guess();

    req.headers[AppConstHeaders.TIMEZONE] = reqTZ;
    req.timezone = reqTZ;

    next();
  }
}
