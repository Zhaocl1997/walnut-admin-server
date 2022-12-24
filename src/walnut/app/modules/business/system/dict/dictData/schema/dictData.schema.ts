import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { SysDictTypeModel } from '../../dictType/schema/dictType.schema';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysDictDataDocument = SysDictDataModel;

export enum DictDataTagTypeEnum {
  PRIMARY = 'primary',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Schema({
  collection: AppConstCollectionName.DICT_DATA,
  versionKey: false,
  timestamps: true,
})
export class SysDictDataModel extends WalnutAbstractModel {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: SysDictTypeModel.name,
  })
  typeId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  label: string;

  @Prop({ type: String })
  value: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ enum: [...Object.values(DictDataTagTypeEnum)] })
  tagType: DictDataTagTypeEnum;

  @Prop({ type: String })
  description: string;
}

export const SysDictDataSchema = createWalnutSchema(SysDictDataModel);
