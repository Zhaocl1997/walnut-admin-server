import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysLocaleEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysLocaleEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformObjectIdToStringId()
  langId: Schema.Types.ObjectId;

  key: string;

  value: string;
}
