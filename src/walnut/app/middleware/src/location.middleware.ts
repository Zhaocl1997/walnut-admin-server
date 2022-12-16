import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { AppConstHeaders } from '@/const/app/header';

@Injectable()
export class LocationMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const reqLocation =
      (req.headers[AppConstHeaders.LOCATION] as string) ||
      (req.headers[AppConstHeaders.LOCATION.toLowerCase()] as string);

    if (reqLocation) {
      req.location = Buffer.from(reqLocation, 'base64').toString();
    }

    next();
  }
}
