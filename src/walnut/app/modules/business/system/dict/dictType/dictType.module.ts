import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLogOperateModule } from '../../logs/operate/log.module';

import { SysDictTypeController } from './dictType.controller';
import { SysDictTypeRepository } from './dictType.repository';
import { SysDictTypeService } from './dictType.service';
import { SysDictTypeModel, SysDictTypeSchema } from './schema/dictType.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysDictTypeModel.name, schema: SysDictTypeSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysLogOperateModule,
  ],
  controllers: [SysDictTypeController],
  providers: [SysDictTypeRepository, SysDictTypeService],
  exports: [SysDictTypeService],
})
export class SysDictTypeModule {}
