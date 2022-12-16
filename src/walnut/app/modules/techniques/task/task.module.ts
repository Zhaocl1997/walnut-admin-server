import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppSettingsModule } from '@/modules/app/setting/setting.module';
import { SysLocaleModule } from '@/modules/business/system/locale/locale.module';

import { AppTasksService } from './task.service';
import { SysLangModule } from '@/modules/business/system/lang/lang.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppSettingsModule,
    SysLangModule,
    SysLocaleModule,
  ],
  providers: [AppTasksService],
  exports: [AppTasksService],
})
export class AppTaskModule implements OnModuleInit {
  constructor(private readonly taskService: AppTasksService) {}

  async onModuleInit() {
    // excute on module init
    await this.taskService.extractAppSetting();
    await this.taskService.extractSysLocaleMessages();
  }
}
