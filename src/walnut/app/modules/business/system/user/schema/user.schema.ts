import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

import { SysRoleModel } from '../../role/schema/role.schema';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysUserDocument = SysUserModel;

export enum SysUserGenderEnum {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
  UNDESCRIBED = 9,
}

@Schema({
  collection: AppConstCollectionName.USER,
  versionKey: false,
  timestamps: true,
})
export class SysUserModel extends WalnutAbstractModel {
  @Prop({ type: String })
  userName: string;

  @Prop({ type: String })
  nickName: string;

  @Prop({
    type: Number,
    default: 0,
  })
  age: number;

  @Prop({
    enum: [
      SysUserGenderEnum.MALE,
      SysUserGenderEnum.FEMALE,
      SysUserGenderEnum.UNKNOWN,
      SysUserGenderEnum.UNDESCRIBED,
    ],
    default: SysUserGenderEnum.UNDESCRIBED,
  })
  gender: SysUserGenderEnum;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  emailAddress: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: SysRoleModel.name }],
  })
  role: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  hashedRefreshToken: string;
}

export const SysUserSchema = createWalnutSchema(SysUserModel);

SysUserSchema.pre('save', async function (next) {
  const user = this as SysUserModel;
  if (user.isModified('password')) {
    const salt = await genSalt();
    user.password = await hash(user.password, salt);
  }
  next();
});
