import { Schema } from 'mongoose';
import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysRoleEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<any>) {
    super();
    Object.assign(this, partial);
  }

  roleName: string;

  description: string;

  order: number;

  status: boolean;

  @TransformObjectIdToStringId()
  menus: Schema.Types.ObjectId[];
}
