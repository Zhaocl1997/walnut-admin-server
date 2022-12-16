import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedAreaController } from './area.controller';
import { SharedAreaService } from './area.service';
import { SharedAreaModel, SharedAreaSchema } from './schema/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SharedAreaModel.name, schema: SharedAreaSchema }],
      AppConstDatabaseConnectionName.PRIMARY,
    ),
  ],
  controllers: [SharedAreaController],
  providers: [SharedAreaService],
  exports: [SharedAreaService],
})
export class SharedAreaModule {}
