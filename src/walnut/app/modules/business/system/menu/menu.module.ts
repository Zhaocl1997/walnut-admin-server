import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLangModule } from '../lang/lang.module';
import { SysLocaleModule } from '../locale/locale.module';
import { SysLogOperateModule } from '../logs/operate/log.module';

import { SysRoleModule } from '../role/role.module';
import { SysMenuController } from './menu.controller';
import { SysMenuRepository } from './menu.repository';
import { SysMenuService } from './menu.service';
import { SysMenuModel, SysMenuSchema } from './schema/menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysMenuModel.name, schema: SysMenuSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysRoleModule,
    SysLangModule,
    SysLocaleModule,
    SysLogOperateModule,
  ],
  controllers: [SysMenuController],
  providers: [SysMenuRepository, SysMenuService],
  exports: [SysMenuService],
})
export class SysMenuModule {}
