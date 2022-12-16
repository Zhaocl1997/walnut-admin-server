import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { ApiWalnutOkResponse } from '@/decorators/swagger/response.decorator';
import { LogAuth } from '@/decorators/walnut/log.auth.decorator';

import { AuthWithPwdDTO } from '../dto/auth.dto';
import { AppTokenEntity } from '../entities/auth.entity';
import { LocalPasswordGuard } from '../guards/local/local-password.guard';
import { AuthPwdService } from '../services/pwd.service';
import { JwtAccessGuard } from '../guards/jwt/jwt-access.guard';
import { WalnutUser } from '@/decorators/user.decorator';
import { AppConstLogAuthType } from '@/const/decorator/logAuth';
import { FunctionalCheck } from '@/decorators/walnut/functional.decorator';
import { AppConstSettingKeys } from '@/const/app/cache';

@ApiTags('auth/pwd')
@Controller('auth/pwd')
export class AuthPwdController {
  constructor(private readonly authPwdService: AuthPwdService) {}

  @LogAuth(AppConstLogAuthType.PWD)
  @UseGuards(LocalPasswordGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(AppTokenEntity)
  @ApiWalnutOkResponse({
    description: 'Auth with userName and password',
    DTO: AppTokenEntity,
  })
  @FunctionalCheck(AppConstSettingKeys.APP_AUTH_ACCOUNT)
  async authWithPwd(
    @WalnutUser() user: IWalnutTokenPayload,
    @Body() payload: AuthWithPwdDTO,
  ) {
    return await this.authPwdService.generateAuthTokens(user);
  }

  @UseGuards(JwtAccessGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiWalnutOkResponse({
    description: 'Signout, remove refresh token in db',
    DTO: undefined,
  })
  async signout(@WalnutUser() user: IWalnutTokenPayload) {
    await this.authPwdService.signout(user);
    return true;
  }
}
