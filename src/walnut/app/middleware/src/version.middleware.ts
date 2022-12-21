import { AppConstHeaders } from '@/const/app/header';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
const packageJson = require('../../../../../package.json');

@Injectable()
export class VersionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const version = this.configService.get<string>('app.api.version');

    req.headers[AppConstHeaders.VERSION] = version;
    req.version = version;

    req.headers[AppConstHeaders.REPO_VERSION] = packageJson.version;
    req.repoVersion = packageJson.version;

    next();
  }
}
