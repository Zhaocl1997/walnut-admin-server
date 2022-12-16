import { Schema } from 'mongoose';
import { Exclude } from 'class-transformer';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysUserOauthEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysUserOauthEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformObjectIdToStringId()
  userId: Schema.Types.ObjectId;

  provider: string;

  @Exclude()
  providerId: string;

  status: boolean;
}
