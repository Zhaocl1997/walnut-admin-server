import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './walnut/app/app.module';
import { WalnutSuccessResponseInterceptor } from './walnut/app/interceptors/response/success.interceptor';
import { WalnutExceptionDataInvalid } from './walnut/app/exceptions/bussiness/data';
import { join } from 'path';
import { SocketIoAdapter } from '@/socket/socket.adapter';

// TODO events change permission & role guard
// TODO task schedule
// TODO sse
// TODO remove enum, use as const
// https://blog.bitsrc.io/difference-between-middleware-interceptor-and-filter-in-the-nest-js-ecosystem-c71fb3ba32f6

// middleware => guards => interceptors => pipes => interceptors

// In general, the request lifecycle looks like the following:
// Incoming request
// Globally bound middleware
// Module bound middleware
// Global guards
// Controller guards
// Route guards
// Global interceptors (pre-controller)
// Controller interceptors (pre-controller)
// Route interceptors (pre-controller)
// Global pipes
// Controller pipes
// Route pipes
// Route parameter pipes
// Controller (method handler)
// Service (if exists)
// Route interceptor (post-request)
// Controller interceptor (post-request)
// Global interceptor (post-request)
// Exception filters (route, then controller, then global)
// Server response
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  const configService = app.get(ConfigService);
  const APIPrefix = configService.get('app.api.prefix');
  const APIVersion = configService.get('app.api.version');

  const port = configService.get('app.port');
  const env = configService.get('NODE_ENV');

  const reflector = app.get(Reflector);

  /* only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc) */
  // app.enable('trust proxy');

  /* socket io adapter */
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  /* hbs engine for email */
  app.setBaseViewsDir(join(__dirname, '..', 'src/walnut/app/views'));
  app.setViewEngine('hbs');

  /* uri verioning */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: APIVersion,
    prefix: `${APIPrefix}/v`,
  });

  /* global interceptors */
  app.useGlobalInterceptors(
    new WalnutSuccessResponseInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );

  /* global pipes */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // TODO
      // false means allow extra fields that are not defined on DTO
      whitelist: false,
      exceptionFactory: (errors: ValidationError[]) => {
        return new WalnutExceptionDataInvalid(
          errors
            .map((i) => Object.values(i.constraints))
            .flat()
            .join(', '),
        );
      },
    }),
  );

  /* api document */
  const options = new DocumentBuilder()
    .setTitle('NestJS Walnut Admin App')
    .setDescription('Document of API details')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`APP is running in ${env} mode on ${await app.getUrl()}`);
  console.log(`Swagger document is host on ${await app.getUrl()}/api`);
}

bootstrap();
