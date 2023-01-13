import { Exclude } from 'class-transformer';

import { TransformToFormattedTime } from '@/decorators/transform.decorator';
import { AppMonitorUserEntity } from './user.entity';

export class AppMonitorUserListEntity extends AppMonitorUserEntity {
  constructor(partial: Partial<AppMonitorUserListEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  visitorId: string;

  @Exclude()
  userName: string;

  @Exclude()
  country: string;

  @Exclude()
  province: string;

  @Exclude()
  area: string;

  @Exclude()
  isp: string;

  @Exclude()
  userAgent: string;

  @Exclude()
  netType: string;

  @Exclude()
  platform: string;

  @Exclude()
  vp: string;

  @Exclude()
  sr: string;

  @Exclude()
  device: string;

  @Exclude()
  engine: string;

  @Exclude()
  currentRouter: string;

  @Exclude()
  @TransformToFormattedTime()
  authTime: string;
}
