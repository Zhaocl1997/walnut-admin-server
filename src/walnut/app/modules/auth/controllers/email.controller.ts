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

import { SendAuthEmailDTO, AuthWithEmailDTO } from '../dto/auth.dto';
import { AppTokenEntity } from '../entities/auth.entity';
import { LocalEmailGuard } from '../guards/local/local-email.guard';
import { AuthEmailService } from '../services/email.service';
import { AppConstLogAuthType } from '@/const/decorator/logAuth';
import { FunctionalCheck } from '@/decorators/walnut/functional.decorator';
import { AppConstSettingKeys } from '@/const/app/cache';

@ApiTags('auth/email')
@Controller('auth/email')
export class AuthEmailController {
  constructor(private readonly authEmailService: AuthEmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @FunctionalCheck(AppConstSettingKeys.VERIFY_EMIAL_SEND)
  async sendAuthEmail(
    @Request() req: IWalnutRequest,
    @Body() payload: SendAuthEmailDTO,
  ) {
    return await this.authEmailService.sendAuthEmail(payload, req.language);
  }

  @LogAuth(AppConstLogAuthType.EMAIL)
  @UseGuards(LocalEmailGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(AppTokenEntity)
  @ApiWalnutOkResponse({
    description: 'Auth with emailAddress and verifyCode',
    DTO: AppTokenEntity,
  })
  @FunctionalCheck(AppConstSettingKeys.APP_AUTH_EMAIL)
  async authWithEmail(
    @WalnutUser() user: IWalnutTokenPayload,
    @Body() payload: AuthWithEmailDTO,
  ) {
    return await this.authEmailService.generateAuthTokens(user);
  }
}
