import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SysLogAuthController } from './log.auth.controller';
import { SysLogAuthRepo } from './log.auth.repository';

import { SysLogAuthService } from './log.auth.service';
import { SysLogAuthModel, SysLogAuthSchema } from './schema/log.auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SysLogAuthModel.name, schema: SysLogAuthSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
  ],
  controllers: [SysLogAuthController],
  providers: [SysLogAuthRepo, SysLogAuthService],
  exports: [SysLogAuthService],
})
export class SysLogAuthModule {}
