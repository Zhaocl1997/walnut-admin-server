import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLocaleModule } from '../locale/locale.module';
import { SysLogOperateModule } from '../logs/operate/log.module';

import { SysLangController } from './lang.controller';
import { SysLangRepository } from './lang.repository';
import { SysLangService } from './lang.service';
import { SysLangModel, SysLangSchema } from './schema/lang.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysLangModel.name, schema: SysLangSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    forwardRef(() => SysLocaleModule),
    SysLogOperateModule,
  ],
  controllers: [SysLangController],
  providers: [SysLangRepository, SysLangService],
  exports: [SysLangService],
})
export class SysLangModule {}
