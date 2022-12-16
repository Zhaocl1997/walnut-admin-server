import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as cors from 'cors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: IWalnutRequest, res: IWalnutResponse, next: NextFunction) {
    const allowOrigin = this.configService.get<string | boolean | string[]>(
      'middleware.cors.allowOrigin',
    );

    const allowMethod = this.configService.get<string[]>(
      'middleware.cors.allowMethod',
    );
    const allowHeader = this.configService.get<string[]>(
      'middleware.cors.allowHeader',
    );

    const corsOptions: cors.CorsOptions = {
      origin: allowOrigin,
      methods: allowMethod,
      allowedHeaders: allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}
