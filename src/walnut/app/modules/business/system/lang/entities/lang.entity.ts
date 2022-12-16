import { WalnutAbstractEntity } from '@/common/entity/base.entity';

export class SysLangEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysLangEntity>) {
    super();
    Object.assign(this, partial);
  }

  lang: string;

  description: string;

  order: number;

  status: boolean;
}
