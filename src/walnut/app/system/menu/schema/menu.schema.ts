import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MenuDocument = Menu & Document;

enum MenuTypeEnum {
  CATALOG = 'catalog',
  MENU = 'menu',
  ELEMENT = 'element',
}

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Menu extends Document {
  @Prop()
  pid: MongooseSchema.Types.ObjectId;

  /* 类型 */
  @Prop({
    enum: [MenuTypeEnum.CATALOG, MenuTypeEnum.MENU, MenuTypeEnum.ELEMENT],
    default: MenuTypeEnum.CATALOG,
  })
  type: MenuTypeEnum;

  /* 路由地址 */
  @Prop({ unique: true })
  path: string;

  /* 路由名称 */
  @Prop({ unique: true })
  name: string;

  /* 路由组件路径 */
  @Prop({ unique: true })
  component: string;

  @Prop({ unique: true })
  title: string;

  @Prop()
  icon: string;

  @Prop()
  order: number;

  /* 是否外链 */
  @Prop({ default: false })
  external: boolean;

  /* 是否内链 */
  @Prop({ default: false })
  internal: boolean;

  /* 链接地址 */
  @Prop()
  url: string;

  /* 是否显示在左侧菜单 */
  @Prop({ default: true })
  show: boolean;

  /* 是否缓存 */
  @Prop({ default: false })
  cache: boolean;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

MenuSchema.pre('findOneAndUpdate', async function (next) {
  console.log('[menu pre findOneAndUpdate]');
  next();
});

MenuSchema.pre('save', async function (next) {
  console.log('[menu pre save]');
  next();
});
