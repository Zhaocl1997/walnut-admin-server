import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLogOperateController } from './log.controller';
import { SysLogOperateRepository } from './log.repository';

import { SysLogOperateService } from './log.service';
import { SysLogOperateModel, SysLogOperateSchema } from './schema/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysLogOperateModel.name, schema: SysLogOperateSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
  ],
  controllers: [SysLogOperateController],
  providers: [SysLogOperateRepository, SysLogOperateService],
  exports: [SysLogOperateService],
})
export class SysLogOperateModule {}
