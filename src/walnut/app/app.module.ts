import {
  Module,
  NestModule,
  MiddlewareConsumer,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseConfigService } from '../config/database';
import configuration from '../config/configuration';

import { LoggerMiddleware } from './middleware/logger';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './system/user/user.module';
import { RoleModule } from './system/role/role.module';
import { MenuModule } from './system/menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      load: [configuration],
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),

    AuthModule,
    UserModule,
    RoleModule,
    MenuModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
