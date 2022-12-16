import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysMenuEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysMenuEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformObjectIdToStringId()
  pid: Schema.Types.ObjectId;

  type: string;

  path: string;

  name: string;

  component: string;

  title: string;

  icon: string;

  order: number;

  ternal: string;

  url: string;

  show: boolean;

  cache: boolean;

  status: boolean;

  affix: boolean;

  permission: string;

  menuActiveName: string;

  menuActiveSameTab: boolean;

  badge: string;

  animationName: string;

  activeIcon: string;

  position: boolean;

  leaveTip: boolean;
}
