import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysDictTypeDto } from './dto/dictType.dto';
import { SysDictTypeEntity } from './entities/dictType.entity';
import {
  SysDictTypeDocument,
  SysDictTypeModel,
} from './schema/dictType.schema';

@Injectable()
export class SysDictTypeRepository extends WalnutAbstractRepository<
  SysDictTypeDocument,
  SysDictTypeDto,
  SysDictTypeEntity
> {
  constructor(
    @AppInjectModel(SysDictTypeModel.name)
    private readonly model: Model<SysDictTypeDocument>,
  ) {
    super(model, SysDictTypeEntity, 'type');
  }
}
