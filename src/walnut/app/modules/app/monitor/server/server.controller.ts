import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppMonitorServerService } from './server.service';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { HasRole } from '@/decorators/walnut/hasRole.decorator';
import { AppConstRoles } from '@/const/role';
import { AppConstPermissionMonitorServer } from '@/const/permissions/monitor/server';

@Controller('app/monitor/server')
// @HasRole(AppConstRoles.ADMIN)
@UseGuards(JwtAccessGuard)
export class AppMonitorServerController {
  constructor(private readonly monitorServerService: AppMonitorServerService) {}

  @Get('cpu')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.CPU)
  async getCpu() {
    return await this.monitorServerService.cpu();
  }

  @Get('mem')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.MEM)
  async getMem() {
    return await this.monitorServerService.memory();
  }

  @Get('os')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.OS)
  async getOS() {
    return await this.monitorServerService.os();
  }

  @Get('sys')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.SYS)
  async getSys() {
    return await this.monitorServerService.system();
  }

  @Get('disk')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.DISK)
  async getDisk() {
    return await this.monitorServerService.disk();
  }

  @Get('battery')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.BATTERY)
  async getBattery() {
    return await this.monitorServerService.battery();
  }

  @Get('time')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.TIME)
  async getTime() {
    return await this.monitorServerService.time();
  }

  @Get('network')
  @HttpCode(HttpStatus.OK)
  @HasPermission(AppConstPermissionMonitorServer.NETWORK)
  async getNetwork() {
    return await this.monitorServerService.network();
  }
}
