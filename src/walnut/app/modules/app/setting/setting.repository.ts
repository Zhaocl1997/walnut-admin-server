import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { AppSettingDto } from './dto/setting.dto';
import { AppSettingEntity } from './entities/setting.entity';
import { AppSettingDocument, AppSettingModel } from './schema/setting.schema';

@Injectable()
export class AppSettingRepository extends WalnutAbstractRepository<
  AppSettingDocument,
  AppSettingDto,
  AppSettingEntity
> {
  constructor(
    @AppInjectModel(AppSettingModel.name)
    private readonly model: Model<AppSettingDocument>,
  ) {
    super(model, AppSettingEntity, ['settingKey']);
  }
}
