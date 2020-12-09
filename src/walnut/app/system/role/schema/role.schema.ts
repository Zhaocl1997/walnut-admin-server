import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Role extends Document {
  @Prop()
  rolename: string;

  @Prop()
  description: string;

  @Prop()
  order: number;

  @Prop()
  menus: Array<MongooseSchema.Types.ObjectId>;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  deleted: boolean;
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
