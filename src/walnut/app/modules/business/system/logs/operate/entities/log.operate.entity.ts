import { Transform } from 'class-transformer';
import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { AppConstLogOperateAction } from '@/const/decorator/logOperate';
import {
  TransformObjectIdToStringId,
  TransformToFormattedTime,
} from '@/decorators/transform.decorator';

export class SysLogOperateEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysLogOperateEntity>) {
    super();
    Object.assign(this, partial);
  }

  title: string;

  @Transform(({ value }) => AppConstLogOperateAction[value])
  actionType: string;

  method: string;

  url: string;

  httpVersion: string;

  location: string;

  os: string;

  browser: string;

  statusCode: number;

  requestData: string;

  responseData: string;

  correspondingMS: number;

  @TransformObjectIdToStringId()
  userId: Schema.Types.ObjectId;

  userName: string;

  ip: string;

  invokingMethod: string;

  @TransformToFormattedTime()
  operatedAt: Date;

  success: boolean;
}
