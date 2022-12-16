import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AppConstQueue } from '@/const/app/queue';

import { AppMailerService } from './mailer.service';
import { AppMailerProcessor } from './mailer.processor';
import { AppMailerConfigService } from './mailer.config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: AppMailerConfigService,
    }),

    BullModule.registerQueue({
      name: AppConstQueue.EMAIL,
    }),
  ],
  controllers: [],
  providers: [AppMailerService, AppMailerProcessor],
  exports: [AppMailerService],
})
export class AppMailerModule {}
