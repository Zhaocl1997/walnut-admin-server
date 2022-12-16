import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';

import { SysLogAuthModel } from './schema/log.auth.schema';
import { SysLogAuthRepo } from './log.auth.repository';
import { SysLogAuthDTO } from './dto/log.auth.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { Model } from 'mongoose';

@Injectable()
export class SysLogAuthService {
  constructor(
    @AppInjectModel(SysLogAuthModel.name)
    private readonly logAuthModel: Model<SysLogAuthModel>,
    private readonly logAuthRepo: SysLogAuthRepo,
  ) {}

  // base CRUD
  async create(dto: SysLogAuthDTO) {
    return await this.logAuthRepo.create(dto);
  }

  async delete(id: string) {
    return await this.logAuthRepo.delete(id);
  }

  async deleteMany(ids: string) {
    return await this.logAuthRepo.deleteMany(ids);
  }

  async findAll(params: WalnutListRequestDTO<SysLogAuthDTO>) {
    return await this.logAuthRepo.list(params);
  }
}
