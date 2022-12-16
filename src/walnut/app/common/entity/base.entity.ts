import { Exclude } from 'class-transformer';
import { Schema } from 'mongoose';
import {
  TransformObjectIdToStringId,
  TransformToFormattedTime,
} from '@/decorators/transform.decorator';

export class WalnutAbstractEntity {
  @TransformObjectIdToStringId()
  _id: Schema.Types.ObjectId;

  @TransformToFormattedTime()
  createdAt: Date;

  @TransformToFormattedTime()
  updatedAt: Date;

  @Exclude()
  deleted: Boolean;
}
