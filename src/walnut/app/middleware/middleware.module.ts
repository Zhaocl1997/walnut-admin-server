import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { I18nMiddleware } from 'nestjs-i18n';

import { CompressionMiddleware } from './src/compression.middleware';
import { CookieParserMiddleware } from './src/cookieParser.middleware';
import { CorsMiddleware } from './src/cors.middleware';
import { CsurfMiddleware } from './src/csurf.middleware';
import { ErrorMiddleware } from './src/error.middleware';
import { FingerprintMiddleware } from './src/fingerprint.middleware';
import { HelmetMiddleware } from './src/helmet.middleware';
import { IdMiddleware } from './src/id.middleware';
import { IpMiddleware } from './src/ip.middleware';
import { LanguageMiddleware } from './src/language.middleware';
import { LocationMiddleware } from './src/location.middleware';
import { LoggerMiddleware } from './src/logger.middleware';
import { ResponseTimeMiddleware } from './src/responseTime.middleware';
import { SessionMiddleware } from './src/session.middleware';
import { TimestampMiddleware } from './src/timestamp.middleware';
import { TimezoneMiddleware } from './src/timezone.middleware';
import { UserAgentMiddleware } from './src/user-agent.middleware';
import { VersionMiddleware } from './src/version.middleware';

@Module({})
export class AppMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        SessionMiddleware,
        CookieParserMiddleware,

        FingerprintMiddleware,
        LocationMiddleware,

        I18nMiddleware,
        LanguageMiddleware,

        CsurfMiddleware,
        CorsMiddleware,
        CompressionMiddleware,
        HelmetMiddleware,

        TimezoneMiddleware,
        TimestampMiddleware,
        IdMiddleware,
        VersionMiddleware,
        ResponseTimeMiddleware,
        UserAgentMiddleware,
        IpMiddleware,

        ErrorMiddleware,
        LoggerMiddleware,
      )
      .forRoutes('*');
  }
}
