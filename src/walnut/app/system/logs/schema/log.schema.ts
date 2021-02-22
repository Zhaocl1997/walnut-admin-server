import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ActionType } from 'src/walnut/app/decorators/actionType';
import { HttpStatus } from '@nestjs/common';

export type MenuDocument = Log & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Log extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    enum: [...Object.values(ActionType)],
    default: ActionType.OTHER,
  })
  action: ActionType;

  @Prop()
  method: string;

  @Prop()
  url: string;

  @Prop()
  httpVersion: string;

  @Prop()
  agent: string;

  @Prop({ enum: [...Object.values(HttpStatus)] })
  statusCode: Number;

  @Prop({
    ref: 'User',
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  ip: string;

  @Prop({ default: false })
  deleted: boolean;
}

export const LogSchema = SchemaFactory.createForClass(Log);
