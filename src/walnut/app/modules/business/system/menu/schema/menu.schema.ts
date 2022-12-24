import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysMenuDocument = SysMenuModel;

export enum SysMenuTypeEnum {
  CATALOG = 'catalog',
  MENU = 'menu',
  ELEMENT = 'element',
}

export enum SysMenuTernalEnum {
  EXTERNAL = 'external',
  INTERNAL = 'internal',
  NONE = 'none',
}

@Schema({
  collection: AppConstCollectionName.MENU,
  versionKey: false,
  timestamps: true,
})
export class SysMenuModel extends WalnutAbstractModel {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  pid: MongooseSchema.Types.ObjectId;

  @Prop({
    enum: [
      SysMenuTypeEnum.CATALOG,
      SysMenuTypeEnum.MENU,
      SysMenuTypeEnum.ELEMENT,
    ],
    default: SysMenuTypeEnum.CATALOG,
  })
  type: SysMenuTypeEnum;

  @Prop({ type: String })
  path: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  component: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  icon: string;

  @Prop({ type: Number })
  order: number;

  @Prop({
    enum: [
      SysMenuTernalEnum.NONE,
      SysMenuTernalEnum.EXTERNAL,
      SysMenuTernalEnum.INTERNAL,
    ],
    default: SysMenuTernalEnum.NONE,
  })
  ternal: SysMenuTernalEnum;

  @Prop({ type: String })
  url: string;

  @Prop({ type: Boolean, default: true })
  show: boolean;

  @Prop({ type: Boolean, default: false })
  cache: boolean;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Boolean })
  affix: boolean;

  @Prop({ type: String })
  permission: string;

  @Prop({ type: String })
  menuActiveName: string;

  @Prop({ type: Boolean })
  menuActiveSameTab: boolean;

  @Prop({ type: String })
  badge: string;

  @Prop({ type: String })
  animationName: string;

  @Prop({ type: String })
  activeIcon: string;

  @Prop({ type: Boolean })
  position: boolean;

  @Prop({ type: Boolean })
  leaveTip: boolean;
}

export const SysMenuSchema = createWalnutSchema(SysMenuModel);
