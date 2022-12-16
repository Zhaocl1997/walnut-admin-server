import { Exclude } from 'class-transformer';
import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import {
  TransformObjectIdToStringId,
  TransformToFormattedTime,
} from '@/decorators/transform.decorator';

export class AppMonitorUserEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<AppMonitorUserEntity>) {
    super();
    Object.assign(this, partial);
  }

  visitorId: string;

  @Exclude()
  @TransformObjectIdToStringId()
  userId: Schema.Types.ObjectId;

  userName: string;

  ip: string;

  location: string;

  os: string;

  browser: string;

  auth: boolean;

  focus: boolean;

  left: boolean;

  currentRouter: string;

  @TransformToFormattedTime()
  lastActiveAt: Date;
}
