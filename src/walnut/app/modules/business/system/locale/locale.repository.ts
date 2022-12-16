import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysLocaleDto } from './dto/locale.dto';
import { SysLocaleEntity } from './entities/locale.entity';
import { SysLocaleDocument, SysLocaleModel } from './schema/locale.schema';

@Injectable()
export class SysLocaleRepository extends WalnutAbstractRepository<
  SysLocaleDocument,
  SysLocaleDto,
  SysLocaleEntity
> {
  constructor(
    @AppInjectModel(SysLocaleModel.name)
    private readonly model: Model<SysLocaleDocument>,
  ) {
    super(model, SysLocaleEntity);
  }
}
