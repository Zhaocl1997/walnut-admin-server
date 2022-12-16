import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import {
  SysUserOauthModel,
  SysUserOauthSchema,
} from './schema/user_oauth.schema';
import { SysUserOauthController } from './user_oauth.controller';
import { SysUserOauthRepository } from './user_oauth.repository';
import { SysUserOauthService } from './user_oauth.serivce';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysUserOauthModel.name, schema: SysUserOauthSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
  ],
  controllers: [SysUserOauthController],
  providers: [SysUserOauthRepository, SysUserOauthService],
  exports: [SysUserOauthService],
})
export class SysUserOauthModule {}
