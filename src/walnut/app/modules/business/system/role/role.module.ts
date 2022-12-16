import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLogOperateModule } from '../logs/operate/log.module';

import { SysRoleController } from './role.controller';
import { SysRoleRepository } from './role.repository';
import { SysRoleService } from './role.service';
import { SysRoleModel, SysRoleSchema } from './schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysRoleModel.name, schema: SysRoleSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysLogOperateModule,
  ],
  controllers: [SysRoleController],
  providers: [SysRoleRepository, SysRoleService],
  exports: [SysRoleService],
})
export class SysRoleModule {}
