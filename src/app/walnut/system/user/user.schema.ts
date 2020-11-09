import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  sex: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
