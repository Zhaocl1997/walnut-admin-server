import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as responseTime from 'response-time';

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    responseTime()(req, res, next);
  }
}
