import { Schema } from 'mongoose';

import { WalnutAbstractEntity } from '@/common/entity/base.entity';
import { DictDataTagTypeEnum } from '../schema/dictData.schema';
import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysDictDataEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysDictDataEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformObjectIdToStringId()
  typeId: Schema.Types.ObjectId;

  label: string;

  value: string;

  order: number;

  status: boolean;

  tagType: DictDataTagTypeEnum;

  description: string;
}
