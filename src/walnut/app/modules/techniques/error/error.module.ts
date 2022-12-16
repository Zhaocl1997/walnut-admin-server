import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { WalnutExceptionFilter } from '@/exceptions/exception.filter';
import { AppErrorController } from './error.controller';

@Module({
  controllers: [AppErrorController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: WalnutExceptionFilter,
    },
  ],
})
export class AppErrorModule {}
