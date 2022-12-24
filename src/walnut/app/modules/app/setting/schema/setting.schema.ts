import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { SysUserModel } from '@/modules/business/system/user/schema/user.schema';
import { AppConstSettingTypeType } from '@/const/app/setting';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type AppSettingDocument = AppSettingModel;

@Schema({
  collection: AppConstCollectionName.APP_SETTING,
  versionKey: false,
  timestamps: true,
})
export class AppSettingModel extends WalnutAbstractModel {
  @Prop({ type: String, required: true })
  settingName: string;

  @Prop({ type: String, required: true })
  settingKey: string;

  @Prop({ type: Object, required: true })
  settingValue: string | number | boolean;

  @Prop({ type: String })
  settingType: AppConstSettingTypeType;

  @Prop({ type: String })
  remark: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SysUserModel.name,
    required: true,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const AppSettingSchema = createWalnutSchema(AppSettingModel);
