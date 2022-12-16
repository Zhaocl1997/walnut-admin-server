import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as cookieParser from 'cookie-parser';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    cookieParser()(req, res, next);
  }
}
