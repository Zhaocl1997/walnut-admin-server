import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WalnutAbstractModel } from '@/common/model/base.model';
import { AppConstCollectionName } from '@/const/db/collectionName';

export type SysLangDocument = SysLangModel & WalnutAbstractModel;

@Schema({
  collection: AppConstCollectionName.LANG,
  versionKey: false,
  timestamps: true,
})
export class SysLangModel extends WalnutAbstractModel {
  /**
   * @description how to remove indexes in mongodb
   * @link https://stackoverflow.com/questions/12337388/mongodb-remove-unique-constraint
   */
  @Prop({ type: String, required: true })
  lang: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Boolean, default: true })
  status: Boolean;
}

export const SysLangSchema = SchemaFactory.createForClass(SysLangModel);

SysLangSchema.virtual('locales', {
  ref: 'SysLocaleModel',
  localField: '_id',
  foreignField: 'langId',
});

SysLangSchema.virtual('localesCount', {
  ref: 'SysLocaleModel',
  localField: '_id',
  foreignField: 'langId',
  count: true,
});
