import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { MongooseConfigService } from './app/walnut/database/mongoose';
import configuration from './app/walnut/config/configuration';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './app/walnut/middleware/logger';

import { UserModule } from './app/walnut/system/user/user.module';

/**
 * Providers are a fundamental concept in Nest.
 * Many of the basic Nest classes may be treated as a provider
 * – services, repositories, factories, helpers, and so on.
 * The main idea of a provider is that it can inject dependencies;
 * this means objects can create various relationships with each other,
 * and the function of "wiring up" instances of objects
 * can largely be delegated to the Nest runtime system.
 * A provider is simply a class annotated with an @Injectable() decorator.
 */

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

    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
