import { Injectable, Logger } from '@nestjs/common';
import { omit } from 'lodash';

import * as systemInfo from 'systeminformation';
import { AppMonitorServerEntity } from './server.entity';

@Injectable()
export class AppMonitorServerService {
  private readonly logger = new Logger(AppMonitorServerService.name);

  constructor() {}

  async cpu() {
    this.logger.debug('Getting cpu info...');

    const { get } = systemInfo;

    const res = await get({ cpu: 'cores brand speed manufacturer' });

    return new AppMonitorServerEntity(res.cpu);
  }

  async memory() {
    this.logger.debug('Getting memory info...');

    const { get } = systemInfo;

    const res = await get({ mem: 'total free used available' });

    return new AppMonitorServerEntity(res.mem);
  }

  async os() {
    this.logger.debug('Getting os info...');

    const { get } = systemInfo;

    const res = await get({ osInfo: 'hostname arch distro platform' });

    return new AppMonitorServerEntity(res.osInfo);
  }

  async system() {
    this.logger.debug('Getting system info...');

    const { get } = systemInfo;

    const res = await get({ system: 'manufacturer model version uuid' });

    return new AppMonitorServerEntity(res.system);
  }

  async disk() {
    this.logger.debug('Getting disk info...');

    const { get } = systemInfo;

    const res = await get({ diskLayout: 'name size device type' });

    return res.diskLayout.map((i) => new AppMonitorServerEntity(i));
  }

  async battery() {
    this.logger.debug('Getting battery info...');

    const { get } = systemInfo;

    const res = await get({
      battery: 'voltage designedCapacity currentCapacity percent',
    });

    return new AppMonitorServerEntity(res.battery);
  }

  async time() {
    this.logger.debug('Getting time info...');

    const { time } = systemInfo;

    const res: any = await time();

    return new AppMonitorServerEntity(res);
  }

  async network() {
    this.logger.debug('Getting network info...');

    const { get } = systemInfo;

    const res: any = await get({
      networkInterfaces: 'iface ip4 mac speed default',
    });

    const formatted = omit(
      res.networkInterfaces
        .map((i) => ({ ...i, netSpeed: i.speed }))
        .find((i) => i.default),
      ['speed', 'default'],
    );

    return new AppMonitorServerEntity(formatted);
  }
}
