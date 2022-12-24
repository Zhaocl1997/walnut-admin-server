import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { SysUserModel } from '../../../user/schema/user.schema';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import {
  AppConstLogAuthType,
  AppConstLogAuthTypeType,
} from '@/const/decorator/logAuth';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysLogAuthDocument = SysLogAuthModel;

@Schema({
  collection: AppConstCollectionName.LOG_AUTH,
  versionKey: false,
  timestamps: {
    createdAt: 'authTime',
    updatedAt: false,
  },
})
export class SysLogAuthModel extends WalnutAbstractModel {
  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  browser: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SysUserModel.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  userName: string;

  @Prop({ type: Boolean })
  success: boolean;

  @Prop({ type: String })
  msg: string;

  @Prop({
    enum: [
      AppConstLogAuthType.PWD,
      AppConstLogAuthType.EMAIL,
      AppConstLogAuthType.PHONE,
      AppConstLogAuthType.QR,
      AppConstLogAuthType.OTHER_QQ,
      AppConstLogAuthType.OTHER_GITHUB,
      AppConstLogAuthType.OTHER_GITEE,
      AppConstLogAuthType.OTHER_WEIBO,
    ],
  })
  type: AppConstLogAuthTypeType;
}

export const SysLogAuthSchema = createWalnutSchema(SysLogAuthModel);
