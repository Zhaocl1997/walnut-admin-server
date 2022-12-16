import { AppConstQueue } from '@/const/app/queue';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppSmsProcessor } from './sms.processor';
import { AppSmsService } from './sms.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: AppConstQueue.PHONE,
    }),
  ],
  controllers: [],
  providers: [AppSmsService, AppSmsProcessor],
  exports: [AppSmsService],
})
export class AppSmsModule {}
