import { AppConstHeaders } from '@/const/app/header';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';

// https://stackoverflow.com/questions/55753163/package-json-is-not-under-rootdir/61467483#61467483

@Injectable()
export class VersionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const version = this.configService.get<string>('app.api.version');

    req.headers[AppConstHeaders.VERSION] = version;
    req.version = version;

    // TODO json resolve in tsconfig will cause dist structure error
    req.headers[AppConstHeaders.REPO_VERSION] = '1.0.0';
    req.repoVersion = '1.0.0';

    next();
  }
}
