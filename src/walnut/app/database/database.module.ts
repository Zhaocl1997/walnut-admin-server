import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: AppConstDatabaseConnectionName.PRIMARY,
      useClass: MongooseConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class AppDatabaseModule {}
