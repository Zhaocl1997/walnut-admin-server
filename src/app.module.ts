import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './app/middleware/logger';

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
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });
  }
}
