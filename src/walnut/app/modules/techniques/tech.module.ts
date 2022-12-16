import { Module } from '@nestjs/common';

import { AppQueueModule } from './queue/queue.module';
import { AppTaskModule } from './task/task.module';
import { AppThrottlerModule } from './throttle/throttler.module';

@Module({
  imports: [AppThrottlerModule, AppQueueModule, AppTaskModule],
})
export class AppTechModule {}
