import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { BullConfigService } from './queue.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
  ],
})
export class AppQueueModule {}
