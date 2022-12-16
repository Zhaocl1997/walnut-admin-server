import { Document, Schema } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class WalnutAbstractModel extends Document<Schema.Types.ObjectId> {
  /**
   * @description delete flag
   */
  @Prop({ type: Boolean, default: false })
  deleted: Boolean;
}
