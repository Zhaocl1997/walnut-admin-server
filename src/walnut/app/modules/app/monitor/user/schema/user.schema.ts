import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { SysUserModel } from '@/modules/business/system/user/schema/user.schema';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type AppMonitorUserDocument = AppMonitorUserModel;

@Schema({
  collection: AppConstCollectionName.USER_MONITOR,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: 'lastActiveAt',
  },
})
export class AppMonitorUserModel extends WalnutAbstractModel {
  @Prop({ type: String, required: true })
  visitorId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SysUserModel.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  userName: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  browser: string;

  @Prop({ type: Boolean })
  auth: boolean;

  @Prop({ type: Boolean })
  focus: boolean;

  @Prop({ type: Boolean })
  left: boolean;

  @Prop({ type: String })
  currentRouter: string;

  @Prop({ type: String })
  authTime: string;
}

export const AppMonitorUserSchema =
  createWalnutSchema(AppMonitorUserModel);
