import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const fp = req.headers['x-fingerprint'] as string;
    req.fingerprint = fp;

    next();
  }
}
