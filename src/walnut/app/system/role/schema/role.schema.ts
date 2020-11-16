import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Role extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  permissionString: string;

  @Prop()
  status: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role',
});

RoleSchema.virtual('usersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role',
  count: true,
});
