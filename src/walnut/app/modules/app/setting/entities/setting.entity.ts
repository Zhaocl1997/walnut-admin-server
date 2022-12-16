import { Schema } from 'mongoose';
import { WalnutAbstractEntity } from '@/common/entity/base.entity';

import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';
import { AppConstSettingTypeType } from '@/const/app/setting';

export class AppSettingEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<AppSettingEntity>) {
    super();
    Object.assign(this, partial);
  }

  settingName: string;

  settingKey: string;

  settingValue: string | number | boolean;

  settingType: AppConstSettingTypeType;

  remark: string;

  @TransformObjectIdToStringId()
  createdBy: Schema.Types.ObjectId;
}
