import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import DBConfig from './modules/database.config';
import JwtConfig from './modules/jwt.config';
import AppConfig from './modules/app.config';
import VendorConfig from './modules/vendor.config';
import CryptoConfig from './modules/crypto.config';
import MiddlewareConfig from './modules/middleware.config';
import EmailConfig from './modules/email.config';
import AuthConfig from './modules/auth.config';
import SocketConfig from './modules/socket.config'
import { validate } from './env.validation';

const ENV = process.env.NODE_ENV;

const envFilePath = `env/.env.${ENV}`
// const envFilePath = `env-local/.env.${ENV}`

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [
        DBConfig,
        JwtConfig,
        AppConfig,
        VendorConfig,
        CryptoConfig,
        MiddlewareConfig,
        EmailConfig,
        AuthConfig,
        SocketConfig
      ],
      isGlobal: true,
      validate,
    }),
  ],
  providers: [],
  exports: [],
})
export class AppConfigModule {}
