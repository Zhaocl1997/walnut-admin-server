import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { AppConstCacheTypeType } from '@/const/app/cache';
import {
  TransformToBytes,
  TransformToFormattedTime,
  TransformToSeconds,
} from '@/decorators/transform.decorator';

export class AppMonitorCacheEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<AppMonitorCacheEntity>) {
    super();
    Object.assign(this, partial);
  }

  key: string;

  @TransformToBytes()
  valueBytes: number;

  @TransformToSeconds()
  expire: number;

  type: AppConstCacheTypeType

  @TransformToFormattedTime()
  startTime: string;

  @TransformToFormattedTime()
  expireTime: string;
}
