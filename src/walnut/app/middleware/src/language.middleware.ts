import { AppConstHeaders } from '@/const/app/header';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const reqLang =
      (req.headers[AppConstHeaders.LANGUAGE] as string) ||
      (req.headers[AppConstHeaders.LANGUAGE.toLowerCase()] as string) ||
      (req.headers['accept-language'] as string) ||
      this.configService.get<string>('app.i18n.fallback');

    req.language = reqLang;

    next();
  }
}
