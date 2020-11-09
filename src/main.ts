import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './walnut/app/app.module';
import { AllExceptionsFilter } from './walnut/app/exceptions/AllExceptionsFilter';
import { LoggingInterceptor } from './walnut/app/interceptors/LoggingInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const APIPrefix = configService.get('server.APIPrefix');

  const port = configService.get('server.port');
  const env = configService.get('NODE_ENV');

  /* api前缀 */
  app.setGlobalPrefix(APIPrefix);

  /* 错误捕获 */
  app.useGlobalFilters(new AllExceptionsFilter());

  /* 拦截器 */
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  /* API文档 */
  const options = new DocumentBuilder()
    .setTitle('NestJS Walnut Admin App')
    .setDescription('Document of API details')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  /* 启动app  */
  await app.listen(port);
  console.log(`APP is running in ${env} mode at port ${port}`);
}

bootstrap();
