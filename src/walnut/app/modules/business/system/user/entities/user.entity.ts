import { Exclude } from 'class-transformer';
import { Schema } from 'mongoose';
import { WalnutAbstractEntity } from '@/common/entity/base.entity';

import { TransformEmail, TransformObjectIdToStringId, TransformPhoneNumber, TransformUsername } from '@/decorators/transform.decorator';

export class SysUserEntity extends WalnutAbstractEntity {
  constructor(partial: Partial<SysUserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @TransformUsername()
  userName: string;

  nickName: string;

  age: number;

  gender: string;

  avatar: string;

  @TransformPhoneNumber()
  phoneNumber: string;

  @TransformEmail()
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
