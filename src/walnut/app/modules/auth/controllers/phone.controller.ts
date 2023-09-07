import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ApiWalnutOkResponse } from '@/decorators/swagger/response.decorator';
import { WalnutUser } from '@/decorators/user.decorator';
import { LogAuth } from '@/decorators/walnut/log.auth.decorator';

import { SendAuthTextMessageDTO, AuthWithPhoneDTO } from '../dto/auth.dto';
import { AppTokenEntity } from '../entities/auth.entity';
import { LocalPhoneGuard } from '../guards/local/local-phone.guard';
import { AuthPhoneService } from '../services/phone.service';
import { AppConstLogAuthType } from '@/const/decorator/logAuth';
import { FunctionalCheck } from '@/decorators/walnut/functional.decorator';
import { AppConstSettingKeys } from '@/const/app/cache';

@ApiTags('auth/phone')
@Controller('auth/phone')
export class AuthPhoneController {
  constructor(private readonly authPhoneService: AuthPhoneService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @FunctionalCheck(AppConstSettingKeys.VERIFY_PHONE_SEND)
  async sendAuthTextMsg(
    @Request() req: IWalnutRequest,
    @Body() payload: SendAuthTextMessageDTO,
  ) {
    return await this.authPhoneService.sendAuthTextMessage(
      payload,
      req.language,
    );
  }

  @LogAuth(AppConstLogAuthType.PHONE)
  @UseGuards(LocalPhoneGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(AppTokenEntity)
  @ApiWalnutOkResponse({
    description: 'Auth with phoneNumber and verifyCode',
    DTO: AppTokenEntity,
  })
  @FunctionalCheck(AppConstSettingKeys.APP_AUTH_PHONE)
  async authWithPhone(
    @WalnutUser() user: IWalnutTokenPayload,
    @Body() payload: AuthWithPhoneDTO,
  ) {
    return await this.authPhoneService.generateAuthTokens(user);
  }
}
