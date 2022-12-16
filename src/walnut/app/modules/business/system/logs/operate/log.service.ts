import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';

import { SysLogOperateModel } from './schema/log.schema';
import { SysLogOperateRepository } from './log.repository';
import { SysLogOperateDTO } from './dto/log.operate.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { Model } from 'mongoose';

@Injectable()
export class SysLogOperateService {
  constructor(
    @AppInjectModel(SysLogOperateModel.name)
    private readonly logOperateModel: Model<SysLogOperateModel>,
    private readonly SysLogOperateRepo: SysLogOperateRepository,
  ) {}

  // base CRUD
  async create(dto: SysLogOperateDTO) {
    return await this.SysLogOperateRepo.create(dto);
  }

  async read(id: string) {
    return await this.SysLogOperateRepo.readById(id);
  }

  async delete(id: string) {
    return await this.SysLogOperateRepo.delete(id);
  }

  async deleteMany(ids: string) {
    return await this.SysLogOperateRepo.deleteMany(ids);
  }

  async findAll(params: WalnutListRequestDTO<SysLogOperateDTO>) {
    return await this.SysLogOperateRepo.list(params, [
      {
        $project: {
          title: 1,
          actionType: 1,
          method: 1,
          userName: 1,
          ip: 1,
          statusCode: 1,
          success: 1,
          operatedAt: 1,
        },
      },
    ]);
  }
}
