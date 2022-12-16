import { Exclude } from 'class-transformer';
import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { AppConstLogAuthTypeType } from '@/const/decorator/logAuth';
import {
  TransformObjectIdToStringId,
  TransformToFormattedTime,
} from '@/decorators/transform.decorator';

export class SysLogAuthEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysLogAuthEntity>) {
    super();
    Object.assign(this, partial);
  }

  ip: string;

  location: string;

  os: string;

  browser: string;

  @Exclude()
  @TransformObjectIdToStringId()
  userId: Schema.Types.ObjectId;

  userName: string;

  success: boolean;

  msg: string;

  @TransformToFormattedTime()
  authTime: Date;

  type: AppConstLogAuthTypeType;
}
