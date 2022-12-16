import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SysUserController } from './user.controller';
import { SysUserService } from './user.service';
import { SysUserModel, SysUserSchema } from './schema/user.schema';
import { SysLogOperateModule } from '../logs/operate/log.module';
import { SysUserRepository } from './user.repository';
import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysUserModel.name, schema: SysUserSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
    SysLogOperateModule,
  ],
  controllers: [SysUserController],
  providers: [SysUserRepository, SysUserService],
  exports: [SysUserService],
})
export class SysUserModule {}
