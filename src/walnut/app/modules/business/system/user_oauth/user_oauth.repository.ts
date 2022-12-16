import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysUserOauthDto } from './dto/user_oauth.dto';
import { SysUserOauthEntity } from './entities/user_oauth.entity';
import {
  SysUserOauthDocument,
  SysUserOauthModel,
} from './schema/user_oauth.schema';

@Injectable()
export class SysUserOauthRepository extends WalnutAbstractRepository<
  SysUserOauthDocument,
  SysUserOauthDto,
  SysUserOauthEntity
> {
  constructor(
    @AppInjectModel(SysUserOauthModel.name)
    private readonly model: Model<SysUserOauthDocument>,
  ) {
    super(model, SysUserOauthEntity);
  }
}
