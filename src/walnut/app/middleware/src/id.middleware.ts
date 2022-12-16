import { AppConstHeaders } from '@/const/app/header';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { v4 } from 'uuid';

@Injectable()
export class IdMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const uuid: string = v4();
    req.headers[AppConstHeaders.ID] = uuid;
    req.id = uuid;
    next();
  }
}
