import { Exclude } from 'class-transformer';
import { Schema } from 'mongoose';
import { WalnutAbstractEntity } from '@/common/entity/base.entity';

import { TransformObjectIdToStringId } from '@/decorators/transform.decorator';

export class SysUserEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysUserEntity>) {
    super();
    Object.assign(this, partial);
  }

  userName: string;

  nickName: string;

  age: number;

  gender: string;

  avatar: string;

  phoneNumber: string;

  emailAddress: string;

  description: string;

  status: boolean;

  @TransformObjectIdToStringId()
  role: Schema.Types.ObjectId[];

  @Exclude()
  password: string;

  @Exclude()
  hashedRefreshToken: string;
}
