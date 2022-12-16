import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppMiddlewareModule } from './middleware/middleware.module';
import { AppI18nModule } from './i18n/i18n.module';
import { AppConfigModule } from '../config/config.module';
import { AppDatabaseModule } from './database/database.module';
import { AppTechModule } from './modules/techniques/tech.module';
import { AppRouterModule } from './router/router.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    // middleware module
    AppMiddlewareModule,

    // i18n module
    AppI18nModule,

    // config module
    AppConfigModule,

    // database module
    AppDatabaseModule,

    // techniques module
    AppTechModule,

    SocketModule,

    // router module
    AppRouterModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
