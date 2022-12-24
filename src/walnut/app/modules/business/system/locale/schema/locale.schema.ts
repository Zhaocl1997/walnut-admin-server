import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { SysLangModel } from '../../lang/schema/lang.schema';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { createWalnutSchema } from '@/common/schema/base.schema';

export type SysLocaleDocument = SysLocaleModel;

@Schema({
  collection: AppConstCollectionName.LOCALE,
  versionKey: false,
  timestamps: true,
})
export class SysLocaleModel extends WalnutAbstractModel {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: SysLangModel.name,
  })
  langId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, index: true })
  key: String;

  @Prop({ type: String })
  value: String;
}

export const SysLocaleSchema = createWalnutSchema(SysLocaleModel);
