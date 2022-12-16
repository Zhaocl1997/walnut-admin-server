import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as csurf from 'csurf';

@Injectable()
export class CsurfMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const myNext = () => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
    };

    csurf({
      cookie: { httpOnly: true },
    })(req, res, myNext);
  }
}
