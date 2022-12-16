import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import { AppMonitorUserModel } from './schema/user.schema';
import { AppMonitorUserRepo } from './user.repository';
import { AppMonitorUserDTO } from './dto/user.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppDayjs } from '@/utils/dayjs';

@Injectable()
export class AppMonitorUserService {
  constructor(
    @AppInjectModel(AppMonitorUserModel.name)
    private readonly appMonitorUserModel: Model<AppMonitorUserModel>,
    private readonly appMonitorUserRepo: AppMonitorUserRepo,
  ) {}

  async core(dto: Partial<AppMonitorUserDTO>, req: IWalnutRequest) {
    const data = {
      ...dto,
      ip: req.realIp,
      location: dto.location && Buffer.from(dto.location, 'base64').toString(),
      os: req.os,
      browser: req.browser,
    };

    const target = await this.appMonitorUserModel.findOne({
      visitorId: dto.visitorId,
    });

    if (data.auth === true && !target?.authTime) {
      data.authTime = AppDayjs().format('YYYY-MM-DD HH:mm:ss');
    }

    await this.appMonitorUserModel.findOneAndUpdate(
      { visitorId: data.visitorId },
      data,
      { upsert: true },
    );
  }

  async findAll(params: WalnutListRequestDTO<AppMonitorUserDTO>) {
    return await this.appMonitorUserRepo.list(params);
  }
}
