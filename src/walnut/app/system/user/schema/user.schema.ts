import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import * as bcrypt from 'bcrypt';

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

  @Prop({
    default: 0,
  })
  age: number;

  @Prop()
  sex: string;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @Prop()
  avatar: string;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop({
    required: true,
    ref: 'Role',
  })
  role: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as User;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});
