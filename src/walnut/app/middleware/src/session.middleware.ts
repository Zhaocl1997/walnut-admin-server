import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    session({
      secret: 'thisisasessionsecret',
      resave: false,
      saveUninitialized: false,
    })(req, res, next);
  }
}
