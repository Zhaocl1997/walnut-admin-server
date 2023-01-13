import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { AppService } from './app.service';
import { Public } from './decorators/app/public';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async hello(@I18n() i18n: I18nContext) {
    return await i18n.t('index.hello');
  }
}
