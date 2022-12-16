import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppConstPermissionHealth } from '@/const/permissions/health';
import { AppConstRoles } from '@/const/role';
import { AppInjectConnection } from '@/database/database.decorator';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { HasRole } from '@/decorators/walnut/hasRole.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';

@ApiTags('app/health')
@Controller('app/health')
@HasRole(AppConstRoles.ADMIN)
@UseGuards(JwtAccessGuard)
export class AppHealthController {
  constructor(
    @AppInjectConnection() private readonly databaseConnection: Connection,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get('network')
  @HealthCheck()
  @HasPermission(AppConstPermissionHealth.NETWORK)
  async checkNetwork() {
    return await this.http.pingCheck('baidu', 'https://www.baidu.com');
  }

  @Get('database')
  @HealthCheck()
  @HasPermission(AppConstPermissionHealth.DB)
  async checkDatabase() {
    return await this.mongoose.pingCheck('database', {
      connection: this.databaseConnection,
    });
  }

  @Get('memory-heap')
  @HealthCheck()
  @HasPermission(AppConstPermissionHealth.MH)
  async checkMemoryHeap() {
    // the process should not use more than 200MB memory
    return await this.memory.checkHeap('memory-heap', 200 * 1024 * 1024);
  }

  @Get('memory-rss')
  @HealthCheck()
  @HasPermission(AppConstPermissionHealth.MR)
  async checkMemoryRSS() {
    // the process should not have more than 200MB RSS memory allocated
    return await this.memory.checkRSS('memory-rss', 200 * 1024 * 1024);
  }

  @Get('disk')
  @HealthCheck()
  @HasPermission(AppConstPermissionHealth.DISK)
  async checkDisk() {
    return await this.disk.checkStorage('disk', {
      // The used disk storage should not exceed 75% of the full disk size
      thresholdPercent: 0.75,
      path: 'C:/',
    });
  }
}
