import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysMenuDto } from './dto/menu.dto';
import { SysMenuEntity } from './entities/menu.entity';
import { SysMenuDocument, SysMenuModel } from './schema/menu.schema';

@Injectable()
export class SysMenuRepository extends WalnutAbstractRepository<
  SysMenuDocument,
  SysMenuDto,
  SysMenuEntity
> {
  constructor(
    @AppInjectModel(SysMenuModel.name)
    private readonly model: Model<SysMenuDocument>,
  ) {
    super(model, SysMenuEntity, 'name');
  }
}
