import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { SysUserModel } from '../../../user/schema/user.schema';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import {
  AppConstLogOperateAction,
  AppConstLogOperateActionType,
} from '@/const/decorator/logOperate';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysLogOperateDocument = SysLogOperateModel;

@Schema({
  collection: AppConstCollectionName.LOG_OPERATE,
  versionKey: false,
  timestamps: {
    createdAt: 'operatedAt',
    updatedAt: false,
  },
})
export class SysLogOperateModel extends WalnutAbstractModel {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: String,
    enum: [...Object.values(AppConstLogOperateAction)],
    default: AppConstLogOperateAction.OTHER,
  })
  actionType: AppConstLogOperateActionType;

  @Prop({ type: String })
  method: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  httpVersion: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  browser: string;

  @Prop({ type: Number })
  statusCode: number;

  @Prop({ type: String })
  requestData: string;

  @Prop({ type: String })
  responseData: string;

  @Prop({ type: Number })
  correspondingMS: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SysUserModel.name,
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  userName: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  invokingMethod: string;

  @Prop({ type: Boolean })
  success: boolean;
}

export const SysLogOperateSchema =
  createWalnutSchema(SysLogOperateModel);
