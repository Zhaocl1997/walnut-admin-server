import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as compression from 'compression';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    compression()(req, res, next);
  }
}
