import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import { AppMonitorUserModel } from './schema/user.schema';
import { AppMonitorUserRepo } from './user.repository';
import { AppMonitorUserDTO } from './dto/user.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppDayjs } from '@/utils/dayjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SocketService } from '@/socket/socket.service';
import { AppMonitorUserListEntity } from './entity/list.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppMonitorUserService {
  constructor(
    @AppInjectModel(AppMonitorUserModel.name)
    private readonly appMonitorUserModel: Model<AppMonitorUserModel>,
    private readonly appMonitorUserRepo: AppMonitorUserRepo,
    private readonly httpService: HttpService,
    private readonly socketService: SocketService,
    private readonly configService: ConfigService,
  ) {}

  async initial(req: IWalnutRequest, dto: Partial<AppMonitorUserDTO>) {
    const res = await firstValueFrom(
      this.httpService.get(`https://ip.useragentinfo.com/json?ip=${dto.ip}`),
    );

    if (res.status === 200) {
      await this.appMonitorUserModel.findOneAndUpdate(
        { visitorId: dto.visitorId },
        {
          ip: res.data.ip,
          country: res.data.country,
          province: res.data.province,
          city: res.data.city,
          area: res.data.area,
          isp: res.data.isp,
          userAgent: req.userAgent.ua,
          netType: dto.netType,
          platform: dto.platform,
          os: req.os,
          browser: req.browser,
          vp: dto.vp,
          sr: dto.sr,
          device: req.userAgent.device?.vendor ?? null,
          engine: req.engine,
          auth: dto.auth,
        },
        { upsert: true },
      );
    }
  }

  async socketHandler(dto: Partial<AppMonitorUserDTO>) {
    await this.appMonitorUserModel.findOneAndUpdate(
      { visitorId: dto.visitorId },
      dto,
    );
  }

  async signin(dto: Partial<AppMonitorUserDTO>) {
    await this.appMonitorUserModel.findOneAndUpdate(
      { visitorId: dto.visitorId },
      {
        auth: true,
        userId: dto.userId,
        userName: dto.userName,
        authTime: AppDayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    );
  }

  async signout(visitorId: string) {
    await this.appMonitorUserModel.findOneAndUpdate(
      { visitorId: visitorId },
      {
        auth: false,
        userId: null,
        userName: null,
        authTime: null,
      },
    );
  }

  async forceQuit(id: string) {
    const target = await this.appMonitorUserModel.findOne({ _id: id });

    // user has auth state and user not left
    // force quit the user with socket
    if (target && target.auth && !target.left) {
      this.socketService.socket.emit(
        `force/quit/${target.visitorId}`,
        target.visitorId,
      );
    }
  }

  async forceQuitByUserId(userId: string) {
    const target = await this.appMonitorUserModel.findOne({ userId });

    // user has auth state and user not left
    // force quit the user with socket
    if (target && target.auth && !target.left) {
      this.socketService.socket.emit(
        `force/quit/${target.visitorId}`,
        target.visitorId,
      );
    }
  }

  async read(id: string) {
    return await this.appMonitorUserRepo.readById(id);
  }

  async findAll(params: WalnutListRequestDTO<AppMonitorUserDTO>) {
    return await this.appMonitorUserRepo.list(
      params,
      [],
      AppMonitorUserListEntity,
    );
  }

  // used for bull task
  // change the auth state based on refresh expire time
  async updateAuthState() {
    const expireSeconds = parseInt(
      this.configService.get<string>('jwt.refresh.expire'),
    );

    const usersWhoseAuthStillTrue = await this.appMonitorUserModel
      .find({ auth: true })
      .select('visitorId authTime');

    const usersNeedToSignout = usersWhoseAuthStillTrue.filter((i) =>
      AppDayjs(i.authTime).add(expireSeconds, 'second').isBefore(AppDayjs()),
    );

    if (usersNeedToSignout.length !== 0) {
      await Promise.all(
        usersNeedToSignout.map((i) => this.signout(i.visitorId)),
      );
    }
  }
}
