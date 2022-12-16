import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLocaleModule } from '../../locale/locale.module';
import { SysLogOperateModule } from '../../logs/operate/log.module';
import { SysDictTypeModule } from '../dictType/dictType.module';

import { SysDictDataController } from './dictData.controller';
import { SysDictDataRepository } from './dictData.repository';
import { SysDictDataService } from './dictData.service';
import { SysDictDataModel, SysDictDataSchema } from './schema/dictData.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysDictDataModel.name, schema: SysDictDataSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysDictTypeModule,
    SysLogOperateModule,
    SysLocaleModule,
  ],
  controllers: [SysDictDataController],
  providers: [SysDictDataRepository, SysDictDataService],
  exports: [SysDictDataService],
})
export class SysDictDataModule {}
