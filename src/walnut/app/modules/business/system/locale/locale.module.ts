import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLangModule } from '../lang/lang.module';
import { SysLogOperateModule } from '../logs/operate/log.module';

import { SysLocaleController } from './locale.controller';
import { SysLocaleRepository } from './locale.repository';
import { SysLocaleService } from './locale.service';
import { SysLocaleModel, SysLocaleSchema } from './schema/locale.schema';

@Module({
  imports: [
    forwardRef(() => SysLangModule),
    MongooseModule.forFeature(
      [{ name: SysLocaleModel.name, schema: SysLocaleSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysLogOperateModule,
  ],
  controllers: [SysLocaleController],
  providers: [SysLocaleRepository, SysLocaleService],
  exports: [SysLocaleService],
})
export class SysLocaleModule {}
