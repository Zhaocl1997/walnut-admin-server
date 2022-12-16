import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { AppInjectModel } from '@/database/database.decorator';
import { SysUserOauthDto } from './dto/user_oauth.dto';
import {
  SysUserOauthDocument,
  SysUserOauthModel,
} from './schema/user_oauth.schema';
import { SysUserOauthRepository } from './user_oauth.repository';

@Injectable()
export class SysUserOauthService {
  constructor(
    @AppInjectModel(SysUserOauthModel.name)
    private readonly sysUserOauthModel: Model<SysUserOauthDocument>,
    private readonly sysUserOauthRepo: SysUserOauthRepository,
  ) {}

  async create(dto: Partial<SysUserOauthDto>) {
    const isExisted = await this.sysUserOauthRepo.isExistByUniqueKey(dto);

    if (isExisted) return;

    return await this.sysUserOauthRepo.create(dto);
  }
}
