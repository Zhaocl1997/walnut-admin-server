import { Module } from '@nestjs/common';

import { SharedAliController } from './ali.controller';
import { SharedAliService } from './ali.service';

@Module({
  imports: [],
  controllers: [SharedAliController],
  providers: [SharedAliService],
  exports: [SharedAliService],
})
export class SharedAliModule {}
