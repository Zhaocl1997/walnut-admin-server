import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';

export type SysDictTypeDocument = SysDictTypeModel;

@Schema({
  collection: AppConstCollectionName.DICT_TYPE,
  versionKey: false,
  timestamps: true,
})
export class SysDictTypeModel extends WalnutAbstractModel {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: String })
  description: string;
}

export const SysDictTypeSchema = SchemaFactory.createForClass(SysDictTypeModel);

SysDictTypeSchema.virtual('dictData', {
  ref: 'SysDictDataModel',
  localField: '_id',
  foreignField: 'typeId',
});

SysDictTypeSchema.virtual('dictDataCount', {
  ref: 'SysDictDataModel',
  localField: '_id',
  foreignField: 'typeId',
  count: true,
});
