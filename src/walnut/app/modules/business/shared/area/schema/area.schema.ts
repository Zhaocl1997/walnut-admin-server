import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppConstCollectionName } from '@/const/db/collectionName';

export type SharedAreaDocument = SharedAreaModel & Document;

@Schema({
  collection: AppConstCollectionName.SHARED_AREA,
  versionKey: false,
  timestamps: false,
})
export class SharedAreaModel extends Document {
  @Prop({ type: String, index: true })
  code: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, ref: SharedAreaModel.name })
  pcode: string;
}

export const SharedAreaSchema = SchemaFactory.createForClass(SharedAreaModel);

SharedAreaSchema.virtual('children', {
  ref: 'SharedAreaModel',
  localField: 'code',
  foreignField: 'pcode',
});

SharedAreaSchema.virtual('parent', {
  ref: 'SharedAreaModel',
  localField: 'pcode',
  foreignField: 'code',
});
