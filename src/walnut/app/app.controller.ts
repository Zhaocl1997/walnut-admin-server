import { Controller, Get, UseGuards } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { AppService } from './app.service';
import { Public } from './decorators/app/public';
import { WalnutUser } from './decorators/user.decorator';
import { JwtAccessGuard } from './modules/auth/guards/jwt/jwt-access.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async hello(@I18n() i18n: I18nContext) {
    return await i18n.t('index.hello');
  }

  @Get('/auth')
  @UseGuards(JwtAccessGuard)
  async helloWithAuth(
    @WalnutUser() user: IWalnutTokenPayload,
    @I18n() i18n: I18nContext,
  ) {
    return await i18n.t('index.user');
  }
}
