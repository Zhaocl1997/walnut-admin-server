import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysLogOperateDTO } from './dto/log.operate.dto';
import { SysLogOperateEntity } from './entities/log.operate.entity';
import { SysLogOperateDocument, SysLogOperateModel } from './schema/log.schema';

@Injectable()
export class SysLogOperateRepository extends WalnutAbstractRepository<
  SysLogOperateDocument,
  SysLogOperateDTO,
  SysLogOperateEntity
> {
  constructor(
    @AppInjectModel(SysLogOperateModel.name)
    private readonly model: Model<SysLogOperateDocument>,
  ) {
    super(model, SysLogOperateEntity);
  }
}
