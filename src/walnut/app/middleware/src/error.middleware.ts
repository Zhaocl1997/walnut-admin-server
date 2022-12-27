import { NextFunction } from 'express';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { AppConstHeaders } from '@/const/app/header';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  constructor() {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const errorHeader =
      (req.headers[AppConstHeaders.ERROR] as string) ||
      (req.headers[AppConstHeaders.ERROR.toLowerCase()] as string);

    if (errorHeader) {
      throw new BadRequestException();
    }

    next();
  }
}
