import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';
import { WalnutAbstractRepository } from '@/common/repository/base.respository';

import { AppMonitorUserDTO } from './dto/user.dto';
import { AppMonitorUserEntity } from './entity/user.entity';
import {
  AppMonitorUserDocument,
  AppMonitorUserModel,
} from './schema/user.schema';

@Injectable()
export class AppMonitorUserRepo extends WalnutAbstractRepository<
  AppMonitorUserDocument,
  AppMonitorUserDTO,
  AppMonitorUserEntity
> {
  constructor(
    @AppInjectModel(AppMonitorUserModel.name)
    private readonly model: Model<AppMonitorUserDocument>,
  ) {
    super(model, AppMonitorUserEntity, ['visitorId']);
  }
}
