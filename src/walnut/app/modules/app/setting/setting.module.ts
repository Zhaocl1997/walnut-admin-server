import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppSettingController } from './setting.controller';
import { AppSettingRepository } from './setting.repository';
import { AppSettingService } from './setting.service';
import { AppSettingModel, AppSettingSchema } from './schema/setting.schema';
import { SysLogOperateModule } from '@/modules/business/system/logs/operate/log.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AppSettingModel.name, schema: AppSettingSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysLogOperateModule,
  ],
  controllers: [AppSettingController],
  providers: [AppSettingRepository, AppSettingService],
  exports: [AppSettingService],
})
export class AppSettingsModule {}
