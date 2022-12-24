import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { SysUserModel } from '../../user/schema/user.schema';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysUserOauthDocument = SysUserOauthModel;

@Schema({
  collection: AppConstCollectionName.USER_OAUTH,
  versionKey: false,
  timestamps: true,
})
export class SysUserOauthModel extends WalnutAbstractModel {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: SysUserModel.name,
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  provider: string;

  @Prop({ type: String })
  providerId: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const SysUserOauthSchema = createWalnutSchema(SysUserOauthModel);
