import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AppSettingService } from '@/modules/app/setting/setting.service';
import { SysLocaleService } from '@/modules/business/system/locale/locale.service';
import { AppConstTaskNames } from '@/const/app/task';
import { AppMonitorUserService } from '@/modules/app/monitor/user/user.service';

@Injectable()
export class AppTasksService {
  private readonly logger = new Logger(AppTasksService.name);

  constructor(
    private readonly appSettingService: AppSettingService,
    private readonly sysLocaleService: SysLocaleService,
    private readonly appMonitorUserService: AppMonitorUserService
  ) { }

  // extract app settings into cache every hour
  @Cron(CronExpression.EVERY_HOUR, { name: AppConstTaskNames.APP_SETTINGS })
  async extractAppSettingCron() {
    await this.appSettingService.extractAppSettingIntoCache();
  }

  // extract locale messagess into cache every hour
  @Cron(CronExpression.EVERY_HOUR, { name: AppConstTaskNames.LOCALE_MESSAGES })
  async extractSysLocaleMessagesCron() {
    await this.sysLocaleService.extractLocaleMessagesIntoCache();
  }

  // update monitor user collection auth state every hour
  @Cron(CronExpression.EVERY_HOUR, { name: AppConstTaskNames.AUTH_STATE })
  async updateAuthStateCron() {
    await this.appMonitorUserService.updateAuthState();
  }
}
