import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { AppHealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [AppHealthController],
})
export class AppHealthModule {}
