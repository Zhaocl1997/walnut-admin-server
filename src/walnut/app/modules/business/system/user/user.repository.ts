import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysUserDto } from './dto/user.dto';
import { SysUserEntity } from './entities/user.entity';
import { SysUserDocument, SysUserModel } from './schema/user.schema';

@Injectable()
export class SysUserRepository extends WalnutAbstractRepository<
  SysUserDocument,
  SysUserDto,
  SysUserEntity
> {
  constructor(
    @AppInjectModel(SysUserModel.name)
    private readonly model: Model<SysUserDocument>,
  ) {
    super(model, SysUserEntity, ['userName', 'emailAddress', 'phoneNumber']);
  }
}
