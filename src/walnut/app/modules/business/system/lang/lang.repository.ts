import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysLangDto } from './dto/lang.dto';
import { SysLangEntity } from './entities/lang.entity';
import { SysLangDocument, SysLangModel } from './schema/lang.schema';

@Injectable()
export class SysLangRepository extends WalnutAbstractRepository<
  SysLangDocument,
  SysLangDto,
  SysLangEntity
> {
  constructor(
    @AppInjectModel(SysLangModel.name)
    private readonly model: Model<SysLangDocument>,
  ) {
    super(model, SysLangEntity, 'lang');
  }
}
