import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AppSettingService } from '@/modules/app/setting/setting.service';
import { SysLocaleService } from '@/modules/business/system/locale/locale.service';
import { AppConstTaskNames } from '@/const/app/task';

@Injectable()
export class AppTasksService {
  private readonly logger = new Logger(AppTasksService.name);

  constructor(
    private readonly appSettingService: AppSettingService,
    private readonly sysLocaleService: SysLocaleService,
  ) {}

  // extract app settings into cache every hour
  @Cron(CronExpression.EVERY_HOUR, { name: AppConstTaskNames.APP_SETTINGS })
  async extractAppSetting() {
    await this.appSettingService.extractAppSettingIntoCache();
  }

  // extract locale messagess into cache every hour
  @Cron(CronExpression.EVERY_HOUR, { name: AppConstTaskNames.LOCALE_MESSAGES })
  async extractSysLocaleMessages() {
    await this.sysLocaleService.extractLocaleMessagesIntoCache();
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 30 seconds');
  // }
}
