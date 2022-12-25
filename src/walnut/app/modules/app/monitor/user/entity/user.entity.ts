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

  country: string;

  province: string;

  city: string;

  area: string;

  isp: string;

  userAgent: string;

  netType: string;

  platform: string;

  os: string;

  browser: string;

  vp: string;

  sr: string;

  device: string;

  engine: string;

  auth: boolean;

  focus: boolean;

  left: boolean;

  currentRouter: string;

  @TransformToFormattedTime()
  authTime: string

  @TransformToFormattedTime()
  lastActiveAt: Date;
}
