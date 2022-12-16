import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import {
  AppMonitorUserModel,
  AppMonitorUserSchema,
} from './schema/user.schema';
import { AppMonitorUserController } from './user.controller';
import { AppMonitorUserService } from './user.service';
import { AppMonitorUserRepo } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AppMonitorUserModel.name, schema: AppMonitorUserSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
  ],
  controllers: [AppMonitorUserController],
  providers: [AppMonitorUserService, AppMonitorUserRepo],
  exports: [AppMonitorUserService],
})
export class AppMonitorUserModule {}
