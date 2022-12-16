import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysLogAuthDTO } from './dto/log.auth.dto';
import { SysLogAuthEntity } from './entities/log.auth.entity';
import { SysLogAuthDocument, SysLogAuthModel } from './schema/log.auth.schema';

@Injectable()
export class SysLogAuthRepo extends WalnutAbstractRepository<
  SysLogAuthDocument,
  SysLogAuthDTO,
  SysLogAuthEntity
> {
  constructor(
    @AppInjectModel(SysLogAuthModel.name)
    private readonly model: Model<SysLogAuthDocument>,
  ) {
    super(model, SysLogAuthEntity);
  }
}
