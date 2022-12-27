import { NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AppConstHeaders } from '@/const/app/header';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Injectable()
export class SleepMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const sleepMS =
      req.headers[AppConstHeaders.SLEEP] ||
      req.headers[AppConstHeaders.SLEEP.toLowerCase()];

    if (sleepMS) {
      await sleep(+sleepMS);
    }

    next();
  }
}
