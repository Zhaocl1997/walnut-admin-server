import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  nickName: string;

  @Prop()
  age: number;

  @Prop()
  sex: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  status: boolean;

  @Prop({
    required: true,
    ref: 'Role',
  })
  role: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
