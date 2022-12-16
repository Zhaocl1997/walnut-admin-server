import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysDictDataDto } from './dto/dictData.dto';
import { SysDictDataEntity } from './entities/dictData.entity';
import {
  SysDictDataDocument,
  SysDictDataModel,
} from './schema/dictData.schema';

@Injectable()
export class SysDictDataRepository extends WalnutAbstractRepository<
  SysDictDataDocument,
  SysDictDataDto,
  SysDictDataEntity
> {
  constructor(
    @AppInjectModel(SysDictDataModel.name)
    private readonly model: Model<SysDictDataDocument>,
  ) {
    super(model, SysDictDataEntity);
  }
}
