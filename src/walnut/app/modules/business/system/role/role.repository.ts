import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { SysRoleDto } from './dto/role.dto';
import { SysRoleEntity } from './entities/role.entity';
import { SysRoleDocument, SysRoleModel } from './schema/role.schema';

@Injectable()
export class SysRoleRepository extends WalnutAbstractRepository<
  SysRoleDocument,
  SysRoleDto,
  SysRoleEntity
> {
  constructor(
    @AppInjectModel(SysRoleModel.name)
    private readonly model: Model<SysRoleDocument>,
  ) {
    super(model, SysRoleEntity, 'roleName');
  }
}
