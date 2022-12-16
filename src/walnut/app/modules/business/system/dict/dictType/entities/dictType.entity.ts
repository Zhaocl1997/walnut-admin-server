import { WalnutAbstractEntity } from '@/common/entity/base.entity';

export class SysDictTypeEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysDictTypeEntity>) {
    super();
    Object.assign(this, partial);
  }

  name: string;

  type: string;

  description: string;

  status: boolean;
}
