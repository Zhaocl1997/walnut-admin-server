import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { SysMenuModel } from '../../menu/schema/menu.schema';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysRoleDocument = SysRoleModel;

@Schema({
  collection: AppConstCollectionName.ROLE,
  versionKey: false,
  timestamps: true,
})
export class SysRoleModel extends WalnutAbstractModel {
  @Prop({ type: String })
  roleName: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: SysMenuModel.name }])
  menus: Array<MongooseSchema.Types.ObjectId>;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const SysRoleSchema = createWalnutSchema(SysRoleModel);

SysRoleSchema.virtual('users', {
  ref: 'SysUserModel',
  localField: '_id',
  foreignField: 'role',
});

SysRoleSchema.virtual('usersCount', {
  ref: 'SysUserModel',
  localField: '_id',
  foreignField: 'role',
  count: true,
});
